import { searchTopicIndex } from "../../opensearch/topics/topicIndex.js";
import { CustomError } from "../../util/customError.js";
import * as topicRepository from "./topicRepository.js";
import * as forumRepository from "../forum/forumRepository.js";

const createTopic = async (topicData) => {
    return await topicRepository.createTopic(topicData);
}

const getTopics = async () => {
    return await topicRepository.getTopics();
}

const getTopicById = async (id, userId) => {
    const topic = await topicRepository.getTopicById(id);
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
    return await topicRepository.getMyTopics(id);
}

const getRecentTopics = async (id) => {
    const topics = topicRepository.getRecentTopics(id);
    return topics
}


const updateTopic = async (userId, topicId, title, content) => {
    const topicExists = await topicRepository.getTopicById(topicId);
    if (!topicExists) {
        throw new CustomError("Topic not found", 404);
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
        if (topic.forum.isActive === false) {
            return [];
        }
        if (topic.forum.isPublic === false) {
            const membership = await forumRepository.getIsSubscribed(userId, topic.forum.id);
            if (!membership) {
                return [];
            }
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


export { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics, archivePostById }