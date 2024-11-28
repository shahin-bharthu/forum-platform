import { CustomError } from "../../util/customError.js";
import * as forumRepository from "./forumRepository.js";
import { db } from "../../config/connection.js";

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

const updateForum = async (id, userId, forum) => {
    const forumExists = await forumRepository.getForumById(id);
    
    if (!forumExists) {
        throw new CustomError("Forum not found!", 404);
    }

    if (forumExists.createdBy !== userId) {
        throw new CustomError("You are not authorized to edit this forum", 403);
    }
    return await forumRepository.updateForum(id, forum);
}

const getForumById = async (id) => {
    return await forumRepository.getForumById(id);
}

const getForumByForumId = async (id) => {
    return await forumRepository.getForumByForumId(id);
}

const getForumsByCreator = async (id) => {
    const userForums = await forumRepository.getForumsByCreator(id);
    const publicUserForums = userForums.filter(userForum => userForum.isPublic === true && userForum.isActive === true)
    
    const privateUserForums = userForums.filter(userForum => userForum.isPublic === false && userForum.isActive === true)
    
    const archivedUserForums = userForums.filter(userForum => userForum.isActive === false)
    
    return {publicUserForums, privateUserForums, archivedUserForums};
}


const archiveForum = async (userId, id) => {
    return await forumRepository.archiveForum(userId, id);
}

const updateForumBanner = async (id, userId, {logo}) => {
    return await forumRepository.updateForumBanner(id, userId, {logo});
}

const getTopicByForumId = async (forumId) => {
    return await forumRepository.getTopicByForumId(forumId);
}

const getIsSubscribed = async (user_id, forum_id) => {
    return await forumRepository.getIsSubscribed(user_id, forum_id);
}

const getRecentForums = async (id) => {
    const allForums = await db.Forum.findAll({where: {isActive: true}, order: [['createdAt', 'DESC']]});    
    const userForums = await db.Forum.findAll({where: {createdBy: id}});
    const subscribedForums = await db.UserMembership.findAll({where: {user_id: id}})
    
    // Convert `userForums` and `subscribedForums` into sets of forum IDs
    const userForumIds = userForums.map(forum => forum.id);
    const subscribedForumIds = subscribedForums.map(membership => membership.forum_id);
    
    // Filter out forums that are either created by the user or already subscribed to
    const forumsToSubscribe = allForums.filter(forum => 
        !userForumIds.includes(forum.id) && !subscribedForumIds.includes(forum.id)
    );
    
    return forumsToSubscribe.slice(0,5);
}

export {
  getForums,
  createForum,
  getForumsByCreator,
  updateForum,
  archiveForum,
  updateForumBanner,
  getForumByForumId,
  getForumById,
  getTopicByForumId,
  getIsSubscribed,
  getRecentForums
};