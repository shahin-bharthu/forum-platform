import { Op, where } from "sequelize";
import { db } from "../../config/connection.js";
import { CustomError } from "../../util/customError.js";
import deleteFile from "../../util/deleteFile.js";

const createForum = async (forumData) => {
    const forum = await db.Forum.create({
        name: forumData.name,
        purpose: forumData.purpose,
        isPublic: forumData.isPublic,
        createdBy: forumData.createdBy,
        forum_id: forumData.forum_id
    });

    const createAdminMembership = await db.UserMembership.create({
        user_id: forum.createdBy,
        forum_id: forum.id,
        membership_role: 'ADMIN'
    })
    
    return forum;
};

const getForums = async () => {
    const forums = await db.Forum.findAll();
    return forums;
}

const getActiveForums = async () => {
    return await db.Forum.findAll({where: {isActive: true}});
}

const getSubscribedForums = async (id) => {
    return await db.UserMembership.findAll({where: {user_id: id}})
}

const updateForum = async (forumToBeUpdated, forum) => {
  await forumToBeUpdated.update({
    purpose: forum.purpose,
    isPublic: forum.isPublic,
    isActive: forum.isActive,
  });

  await forumToBeUpdated.save();

  return forumToBeUpdated;
};

const getForumById = async (id) => {
    return await db.Forum.findByPk(id);
};

const getForumByForumId = async (forum_id) => {
    return await db.Forum.findOne({where: {forum_id}, include: 'user'})
}

const getForumsByCreator = async (id) => {
    return await db.Forum.findAll({ where: { createdBy: id } });
}

const archiveForum = async (userId, id) => {
    const forumToBeArchived = await db.Forum.findByPk(id);
    if (!forumToBeArchived) {
        throw new CustomError('Forum not found', 404);
    }
    if (forumToBeArchived.createdBy !== userId) {
        throw new CustomError('Unauthorized to archive forum', 403);
    }
    await forumToBeArchived.update({
        isActive: !forumToBeArchived.isActive
    });
    await forumToBeArchived.save();
    return forumToBeArchived;
}


const updateForumBanner = async (id, userId, { logo }) => {
    const forum = await db.Forum.findByPk(id);
    if (!forum) {
        throw new CustomError('Forum not found', 404);
    }
    if (forum.createdBy !== userId) {
        throw new CustomError('You are not authorized to edit this forum', 403);
    }
    const oldAvatarPath = forum.logo;
    await forum.update({
        logo,
    });

    await forum.save();
    if (oldAvatarPath && oldAvatarPath !== 'forumLogos/defaultAvatar.png') {        
        deleteFile(`../${oldAvatarPath}`);
    }

    return forum;
};

const getTopicByForumId = async (forumId) => {
    const forum = await db.Forum.findOne({where: {forum_id: forumId}});
    const topics = await db.Topic.findAll({where: {forum_id: forum.id}, include: 'user', order: [['createdAt', 'DESC']]});
    if (!topics) {
        throw new CustomError('No topics found for given forum', 404)
    }
    return topics
}

const getIsSubscribed = async (user_id, forum_id) => {    
    const existingMembership = await db.UserMembership.findOne({
        where: {
            user_id,            
            forum_id
        },
    });

    if (existingMembership) {
        return true;
    }
    else {
        return false;
    }
}


const getMembershipRecord = async (user_id, forum_id) => {    
    const membershipRecord = await db.UserMembership.findOne({
        where: {
            user_id,            
            forum_id
        },
    });

    return membershipRecord
}

const createUserMembership = async (user_id, forum_id) => {
    await db.UserMembership.create({
        user_id,
        forum_id
    });
}


export {
  getForums,
  createForum,
  getForumById,
  getForumsByCreator,
  getForumByForumId,
  updateForum,
  archiveForum,
  updateForumBanner,
  getTopicByForumId,
  getIsSubscribed,
  getMembershipRecord,
  createUserMembership,
  getActiveForums,
  getSubscribedForums
};