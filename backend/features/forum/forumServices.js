import { CustomError } from "../../util/customError.js";
import * as forumRepository from "./forumRepository.js";

const createForum = async (forumData) => {
    const forum_id = forumData.name.replace(/\s+/g, '_').toLowerCase();
    forumData["forum_id"] = forum_id
    
    const forumExists = await forumRepository.getForumByForumId(forum_id);

    if (forumExists) {
        throw new CustomError("A forum with this name already exists. Please try another name.", 400);
    }

    const forum = await forumRepository.createForum(forumData);
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