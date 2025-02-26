import { Op, where } from "sequelize";
import { db } from "../../config/connection.js";
import { CustomError } from "../../util/customError.js";
import { getIsSubscribed } from "../forum/forumRepository.js";

const createTopic = async (topicData) => {
    const forumExists = await db.Forum.findByPk(topicData.forum_id);

    if (!forumExists) {
        throw new CustomError('Forum not found', 404);
    }

    if (!forumExists.isActive) {
        throw new CustomError('Cannot create a post in an archived forum', 405);
    }

    const subscribedResult = await getIsSubscribed(topicData.createdBy, topicData.forum_id);    
    if (!subscribedResult) {
        throw new CustomError('Subscribe first to create a post in this forum', 405);
    }
    
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
    const topic = await db.Topic.findByPk(id);
    const creator = await topic.getUser();
    const topic_forum = await topic.getForum();
    const forum_creator = await topic_forum.getUser();    
    
    return {topic, username: creator.username, forum: topic_forum, user: creator, forum_creator};
};

const getMyTopics = async (id) => {
    return await db.Topic.findAll({ where: { createdBy: id }, order: [['createdAt', 'DESC']] });
}

const getRecentTopics = async (id) => {
    const userSubscriptions = await db.UserMembership.findAll({where: {user_id: id}})
    const recentTopics = await Promise.all(userSubscriptions.map(async (subscription) => {
        const topics = await db.Topic.findAll({where: {forum_id: subscription.forum_id, createdBy: {[Op.ne]: id}}, order: [['createdAt', 'DESC']], limit: 2, include: 'forum'})
        return topics
    }));

    return recentTopics.flat();
}

const updateTopic = async(topic, title, content) => {
    await topic.update({
        title: title,
        content: content
    })
    await topic.save();
    return topic;
}

const deleteTopic = async(topic) => {
    return await topic.destroy();
}

const archivePostById = async (id) => {
    const topic = await db.Topic.findByPk(id);
    topic.isActive = !topic.isActive;
    await topic.save();
}

export {createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, archivePostById}