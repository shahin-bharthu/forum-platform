import { Op, where } from "sequelize";
import { db } from "../../config/connection.js";
import { CustomError } from "../../util/customError.js";

const createTopic = async (topicData) => {
    const forumExists = await db.Forum.findByPk(topicData.forum_id);
    if (!forumExists) {
        throw new CustomError('Forum not found', 404);
    }

    const subscribedForum = await db.UserMembership.findOne()
    // if (forumExists.createdBy !== topicData.createdBy || ) {
        
    // }
    const topic = await db.Topic.create({
        title: topicData.title,
        content: topicData.content,
        createdBy: topicData.createdBy,
        forum_id: topicData.forum_id
    });
    
    return topic;
};

const getTopics = async () => {
    const topics = await db.Topic.findAll();
    console.log(topics);
    return topics;
}

const getTopicById = async (id) => {
    return await db.Topic.findByPk(id);
};

// const getForumByForumId = async (forum_id) => {
//     return await db.Forum.findOne({where: {forum_id}})
// }

const getMyTopics = async (id) => {
    return await db.Topic.findAll({ where: { createdBy: id } });
}

const getRecentTopics = async (id) => {
    const subscribedForums = await db.UserMembership.findAll({where: {user_id: id}})
    const topics = await Promise.all(subscribedForums.map(async (forum) => {
        const topics = await db.Topic.findAll({where: {forum_id: forum.forum_id}, order: [['createdAt', 'DESC']], limit: 2})
        return topics
    }));
    return topics
}

export {createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics}