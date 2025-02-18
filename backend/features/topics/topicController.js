import { validationResult } from "express-validator";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import * as topicServices from "./topicServices.js";

const createTopic = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const createdBy = req.user.id
    const {title, content, forum_id} = req.body;
    const topic = await topicServices.createTopic({title, content, forum_id, createdBy});
    
    return res.status(201).json({message: "Topic created successfully", data: topic});
})

const getTopics = asyncErrorHandler(async (req,res,next) => {
    const topics = await topicServices.getTopics();
    return res.status(200).json({message: "Topics fetched successfully", data: topics});
})

const getTopicById = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const user = req.user;
    const topic = await topicServices.getTopicById(id, user.id);
    return res.status(200).json({message: "Topic fetched successfully", data: topic});
})

const getMyTopics = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const topics = await topicServices.getMyTopics(id);
    return res.status(200).json({message: "Topics fetched successfully", data: topics});
})

const getRecentTopics = asyncErrorHandler(async (req,res,next) => {
    const { id } = req.user;
    const topics = await topicServices.getRecentTopics(id);
    return res.status(200).json({message: "Fetched recent topics", data: topics});
})

const updateTopic = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const {id} = req.params;
    const {title, content} = req.body;
    const topic = await topicServices.updateTopic(userId, id, title, content);
    return res.status(200).json({message: "Post edited successfully", data: topic});
})


const deleteTopic = asyncErrorHandler(async (req,res,next) => {
    const userId = req.user.id;
    const {id} = req.params;
    const topic = await topicServices.deleteTopic(userId, id);
    return res.status(204).json();
})

const searchTopics = asyncErrorHandler(async (req,res,next) => {
    const {topicQuery} = req.params;
    const {id} = req.user;
    const topics = await topicServices.searchTopics(topicQuery, id);
    return res.status(200).json({message: `Fetched ${topics.length} topics`, data: topics})
});

export { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics }