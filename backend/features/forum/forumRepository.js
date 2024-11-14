import { db } from "../../config/connection.js";
import { CustomError } from "../../util/customError.js";

const createForum = async (forumData) => {
    const forum = await db.Forum.create({
        name: forumData.name,
        purpose: forumData.purpose,
        isPublic: forumData.isPublic,
        createdBy: forumData.createdBy,
        forum_id: forumData.forum_id
    });
    
    return forum;
};

const getForums = async () => {
    const forums = await db.Forum.findAll();
    return forums;
}

const updateForum = async (id, forum) => {
    const forumToBeUpdated = await db.Forum.findByPk(id);
     if (!forumToBeUpdated) {
            throw new CustomError('Forum not found', 404);
        }
        await forumToBeUpdated.update({
            purpose: forum.purpose,
            isPublic: forum.isPublic,
            isActive: forum.isActive
        });

        await forumToBeUpdated.save();

        return forumToBeUpdated;
}

const getForumById = async (id) => {
    return await db.Forum.findByPk(id);
};

const getForumByForumId = async (forum_id) => {
    return await db.Forum.findOne({where: {forum_id}})
}

const getForumsByCreator = async (id) => {
    return await db.Forum.findAll({ where: { createdBy: id } });
}

const archiveForum = async (id) => {
    const forumToBeArchived = await db.Forum.findByPk(id);
     if (!forumToBeArchived) {
            throw new CustomError('Forum not found', 404);
        }
        await forumToBeArchived.update({
            isActive: !forumToBeArchived.isActive
        });

        await forumToBeArchived.save();

        return forumToBeArchived;
}

export {getForums, createForum, getForumById, getForumsByCreator, getForumByForumId, updateForum, archiveForum}