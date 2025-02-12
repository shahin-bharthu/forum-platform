import { CustomError } from "../../util/customError.js";
import * as forumRepository from "./forumRepository.js";
import * as userRepository from "../user/userRepository.js"
import { db } from "../../config/connection.js";
import { getImage } from "../../util/getImage.js";
import { searchForumIndex } from "../../opensearch-indices/forumIndex.js";

const createForum = async (forumData) => {
    const forum_id = forumData.name.replace(/\s+/g, '_').toLowerCase();
    forumData["forum_id"] = forum_id
    
    const forumExists = await forumRepository.getForumByForumId(forum_id);

    if (forumExists) {
        throw new CustomError(`A forum with this name - ${forumExists.name} already exists. Please try another name.`, 400);
    }

    return await forumRepository.createForum(forumData);
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
    return await forumRepository.updateForum(forumExists, forum);
}

const getForumById = async (id) => {
    const forum = await forumRepository.getForumById(id);
    if (!forum) {
        throw new CustomError(`Forum with forum-id ${id} not found`, 404);
    }
    return forum;
}

const getForumByForumId = async (id) => {
    const forum = await forumRepository.getForumByForumId(id);
    if (!forum) {
        throw new CustomError(`Forum with forum-id ${id} not found`, 404);
    }
    return forum;
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

const getForumBanner = async (id) => {
    const forum = await forumRepository.getForumById(id);
    if (!forum) {
        throw new CustomError('Forum not found', 404);
    }

    const bannerPath = await getImage(forum.logo, "forum");
    return bannerPath;
}


const subscribeToForum = async(id, forum_id) => {
    const forum = await forumRepository.getForumByForumId(forum_id);

    if (!forum) {
        throw new CustomError('Forum not found', 404)
    }

    if (forum.createdBy === id && forum.isActive === false) {
        throw new CustomError('Cannot subscribe', 500);
    }

    const existingMembership = await forumRepository.getIsSubscribed(id, forum_id);

    if (existingMembership) {
        throw new CustomError('User is already subscribed to this forum', 409);
    }

    // increment subscriber count and save updated forum    
    forum.subscriber_count += 1;
    await forum.save(); 
    
    const user = await userRepository.getUserById(id);
    if (!user) {
        throw new CustomError('User not found', 404)
    }

    await forumRepository.createUserMembership(user.id, forum.id);
    return forum;
}


const unSubscribeForum = async (user_id, forum_id) => {
    const forum = await forumRepository.getForumByForumId(forum_id);
    if (!forum) {
        throw new CustomError('Forum not found', 404);
    }

    const user = await userRepository.getUserById(user_id); 
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const existingMembership = await forumRepository.getMembershipRecord(user.id, forum.id);    
    if (!existingMembership) {
        throw new CustomError('Subscription record does not exist', 404);
    }
    await existingMembership.destroy();

    forum.subscriber_count -= 1;
    await forum.save();
    return forum;
}

const searchForums = async (query) => {
    try {
    //     const results = await db.Forum.findAll({
    //         where: {
    //         [db.Sequelize.Op.or]: [
    //             {
    //             name: {
    //                 [db.Sequelize.Op.like]: `%${query}%`
    //             }
    //             },
    //             {
    //             purpose: {
    //                 [db.Sequelize.Op.like]: `%${query}%`
    //             }
    //             }
    //         ]
    //         }
    //     });

    //     return results;
        const results = await searchForumIndex(query);
        const forumData = results.map((result) => {
            return ({
                id: result._source.id,
                name: result._source.name,
                purpose: result._source.purpose
            });
        });
        return forumData;
    } catch (error) {
        throw new CustomError(`Error searching forums: ${error}`, 500);
    }
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
  getRecentForums, 
  getForumBanner,
  subscribeToForum,
  unSubscribeForum,
  searchForums
};