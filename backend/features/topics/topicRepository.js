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

export {createTopic, getTopics, getTopicById, getMyTopics}