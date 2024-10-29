import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import * as topicServices from "./topicServices.js"

const createTopic = asyncErrorHandler(async (req,res,next) => {
    const createdBy = req.user.id
    const {title, content, forum_id} = req.body;
    const topic = await topicServices.createTopic({title, content, forum_id, createdBy});
    
    return res.status(201).json({message: "Topic created successfully", data: topic});
})

const getTopics = asyncErrorHandler(async (req,res,next) => {
    const topics = await topicServices.getTopics();
    return res.status(200).json({message: "Topics fetched successfully", data: topics});
})

// const getForumById = asyncErrorHandler(async (req,res,next) => {
//     const {id} = req.params;
//     const forum = await forumServices.getForumById(id);
//     return res.status(200).json({message: "Forum fetched successfully", data: forum});
// })

// const getForumsByCreator = asyncErrorHandler(async (req,res,next) => {
//     const {id} = req.user;
//     const forums = await forumServices.getForumsByCreator(id);
//     return res.status(200).json({message: "Forums fetched successfully", data: forums});
// })

export { createTopic, getTopics }