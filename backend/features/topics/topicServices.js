import { searchTopicIndex } from "../../opensearch/topics/topicIndex.js";
import { CustomError } from "../../util/customError.js";
import * as topicRepository from "./topicRepository.js";
import * as forumRepository from "../forum/forumRepository.js";
import * as userRepository from "../user/userRepository.js"

const createTopic = async (topicData) => {
    return await topicRepository.createTopic(topicData);
}

const getTopics = async () => {
    return await topicRepository.getTopics();
}

const getTopicById = async (id, userId) => {
    const topic = await topicRepository.getTopicById(id, userId);
    if (!topic) {
        throw new CustomError(`Topic not found`, 404);
    }
    if (topic.forum.isPublic === false) {
        const membershipExists = await forumRepository.getIsSubscribed(userId, topic.topic.forum_id);
        if (!membershipExists) {
            throw new CustomError(`User not authorized to view this topic`, 403);
        }
    }
    return topic;
}

const getMyTopics = async (id) => {
    const myTopics= await topicRepository.getMyTopics(id);

    const myLikedTopics = await Promise.all(myTopics.map(async (topic) => ({
        ...topic.dataValues,
        isLiked: await topicRepository.checkIfAlreadyLiked(id, topic.id)
    })
    ));    
    return myLikedTopics;
}

const getRecentTopics = async (id) => {
    const topics = await topicRepository.getRecentTopics(id);
    const modifiedTopics = await Promise.all(
        topics.map(async (topic) => ({
          ...topic.dataValues,
          isLiked: await topicRepository.checkIfAlreadyLiked(id, topic.id)
        }))
      );
    return modifiedTopics
}


const updateTopic = async (userId, topicId, title, content) => {
    const topicExists = await topicRepository.getTopicById(topicId);
    if (!topicExists) {
        throw new CustomError("Topic not found", 404);
    }
    if (topicExists.topic.isActive === false) {
        throw new CustomError("Cannot edit an archived topic", 403);
    }
    if (topicExists.topic.createdBy !== userId) {
        throw new CustomError("Unauthorized to edit this topic", 403);
    }
    return await topicRepository.updateTopic(topicExists.topic, title, content);
}


const deleteTopic = async (userId, topicId) => {
    const topicExists = await topicRepository.getTopicById(topicId);
    if (!topicExists) {
        throw new CustomError("Topic not found", 404);
    }
    if (topicExists.topic.createdBy !== userId) {
        throw new CustomError("Unauthorized to delete this topic", 403);
    }
    return await topicRepository.deleteTopic(topicExists.topic);
}


const searchTopics = async (query, userId) => {
    const results = await searchTopicIndex(query);
    const topicData = await Promise.all(results.map(async (result) => {
        const topic = await topicRepository.getTopicById(result._source.id);
        if (!topic) {
            throw new CustomError("Topic not found", 404);
        }
        if (topic.forum.isActive === false || topic.forum.isPublic === false) {
            const membership = await forumRepository.getIsSubscribed(userId, topic.forum.id);
            if (!membership) {
                return [];
            }
        }
        if (!topic.topic.isActive) {
            return [];
        }
        return [{
            id: result._source.id,
            title: result._source.title,
            content: result._source.content
        }];
    }));
    return topicData.flat();
}


const archivePostById = async (id, userId) => {
    const topic = await topicRepository.getTopicById(id);
    if (topic.topic.createdBy !== userId) {
        throw new CustomError("Unauthorized to archive this topic", 403);
    }
    return await topicRepository.archivePostById(id);
}

const likeTopic = async (userId, topicId) => {
    const topic = await topicRepository.getTopicById(topicId,userId);
    
    if (!topic) {
        throw new CustomError('Topic not found', 404);
    }

    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    
    const alreadyLiked = await topicRepository.checkIfAlreadyLiked(userId, topicId);
    if (alreadyLiked) {
        throw new CustomError('Topic already liked', 400);
    }

    await topicRepository.likeTopic(userId, topicId);

    topic.topic.likes_count += 1;
    await topic.topic.save();

    return topic;
}

const unlikeTopic = async (userId, topicId) => {
    const topic = await topicRepository.getTopicById(topicId,userId);
    if (!topic) {
        throw new CustomError('Topic not found', 404);
    }

    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const alreadyLiked = await topicRepository.getLikeRecord(userId, topicId);
    if (!alreadyLiked) {
        throw new CustomError('Topic not liked', 400);
    }
    await alreadyLiked.destroy();

    topic.topic.likes_count -= 1;
    await topic.topic.save();

    return topic
}

export { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics, likeTopic, unlikeTopic, archivePostById }