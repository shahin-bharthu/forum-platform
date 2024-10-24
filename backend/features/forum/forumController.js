import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import * as forumServices from "./forumServices.js"

const createForum = asyncErrorHandler(async (req,res,next) => {
    const createdBy = req.user.id
    const {name, purpose} = req.body;
    const forum = await forumServices.createForum({name, purpose, createdBy});
    return res.status(201).json({message: "Forum created successfully", data: forum});
})

const getForums = asyncErrorHandler(async (req,res,next) => {
    const forums = await forumServices.getForums();
    return res.status(200).json({message: "Forums fetched successfully", data: forums});
})

const getForumById = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const forum = await forumServices.getForumById(id);
    return res.status(200).json({message: "Forum fetched successfully", data: forum});
})

const getForumsByCreator = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const forums = await forumServices.getForumsByCreator(id);
    return res.status(200).json({message: "Forums fetched successfully", data: forums});
})

export { getForums, createForum, getForumById, getForumsByCreator }