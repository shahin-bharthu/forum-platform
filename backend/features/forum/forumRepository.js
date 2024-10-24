import { db } from "../../config/connection.js";

const createForum = async (forumData) => {
    const forum = await db.Forum.create({
        name: forumData.name,
        purpose: forumData.purpose,
        createdBy: forumData.createdBy,
    });
    return forum;
};

const getForums = async () => {
    const forums = await db.Forum.findAll();
    console.log(forums);
    return forums;
}

const getForumById = async (id) => {
    return await db.Forum.findByPk(id);
};

const getForumsByCreator = async (id) => {
    return await db.Forum.findAll({ where: { createdBy: id } });
}

export {getForums, createForum, getForumById, getForumsByCreator}