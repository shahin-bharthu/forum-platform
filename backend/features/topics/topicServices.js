import { CustomError } from "../../util/customError.js";
import * as topicRepository from "./topicRepository.js";

const createTopic = async (topicData) => {
    const topic = await topicRepository.createTopic(topicData);
    return topic
}

const getTopics = async () => {
    return await topicRepository.getTopics();
}

const getTopicById = async (id) => {
    return await topicRepository.getTopicById(id);
}

const getMyTopics = async (id) => {
    return await topicRepository.getMyTopics(id);
}

const getRecentTopics = async (id) => {
    const topics = topicRepository.getRecentTopics(id);
    return topics
}

export { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics }