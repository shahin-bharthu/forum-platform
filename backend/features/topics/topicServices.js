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
    if(topic.forum.isPublic === false) {
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
    
    if (!topicExists || topicExists.topic.createdBy !== userId) {
        throw new CustomError("Topic not found or User not authorized to edit this topic", 404);
    }

    return await topicRepository.updateTopic(topicExists.topic, title, content);
}


const deleteTopic = async (userId, topicId) => {
    const topicExists = await topicRepository.getTopicById(topicId);
    
    if (!topicExists || topicExists.topic.createdBy !== userId) {
        throw new CustomError("Topic not found or User not authorized to delete this topic", 404);
    }
    
    return await topicRepository.deleteTopic(topicExists.topic);
}


const searchTopics = async (query) => {
    try {
        const results = await searchTopicIndex(query);
        const topicData = results.map((result) => {
            return ({
                id: result._source.id,
                title: result._source.title,
                content: result._source.content
            });
        });
        return topicData;
    } catch (error) {
        throw new CustomError(`Error searching topics: ${error}`, 500);
    }
}


export { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics }