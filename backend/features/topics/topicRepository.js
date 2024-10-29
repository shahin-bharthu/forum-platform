import { db } from "../../config/connection.js";

const createTopic = async (topicData) => {
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