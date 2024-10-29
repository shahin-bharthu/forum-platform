import { CustomError } from "../../util/customError.js";
import * as topicRepository from "./topicRepository.js";

const createTopic = async (topicData) => {
    const topic = await topicRepository.createTopic(topicData);
    return topic
}

const getTopics = async () => {
    return await topicRepository.getTopics();
}

// const getForumById = async (id) => {
//     return await forumRepository.getForumById(id);
// }

// const getForumsByCreator = async (id) => {
//     return await forumRepository.getForumsByCreator(id);
// }

export { createTopic, getTopics }