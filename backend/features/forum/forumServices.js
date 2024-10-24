import * as forumRepository from "./forumRepository.js";

const createForum = async (forumData) => {
    return await forumRepository.createForum(forumData);
}

const getForums = async () => {
    return await forumRepository.getForums();
}

const getForumById = async (id) => {
    return await forumRepository.getForumById(id);
}

const getForumsByCreator = async (id) => {
    return await forumRepository.getForumsByCreator(id);
}

export { getForums, createForum, getForumById, getForumsByCreator }