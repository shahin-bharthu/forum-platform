import { Op, where } from "sequelize";
import { validationResult } from "express-validator";
import * as forumServices from "./forumServices.js";
import { db } from "../../config/connection.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import { CustomError } from "../../util/customError.js";

const createForum = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const createdBy = req.user.id
    const {name, purpose, isPublic} = req.body;
    const forum = await forumServices.createForum({name, purpose, isPublic, createdBy});
    
    return res.status(201).json({message: "Forum created successfully", data: forum});
})

const getForums = asyncErrorHandler(async (req,res,next) => {
    const forums = await forumServices.getForums();
    return res.status(200).json({message: "Forums fetched successfully", data: forums});
})

const updateForum = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const userId = req.user.id;
    const body = req.body;
    
    const data = await forumServices.updateForum(id, userId, body);

    return res.status(200).json({message: "Forum details have been updated successfully", data: data});
})

const getForumByForumId = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const forum = await forumServices.getForumByForumId(id);
    return res.status(200).json({message: "Forum fetched successfully", data: forum});
})

const getForumById = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const forum = await forumServices.getForumById(id);
    return res.status(200).json({message: "Forum fetched successfully", data: forum});
})

const getForumsByCreator = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const {publicUserForums, privateUserForums, archivedUserForums} = await forumServices.getForumsByCreator(id);
    return res.status(200).json({message: "Forums fetched successfully",  publicUserForums, privateUserForums, archivedUserForums});
})

const subscribeToForum = asyncErrorHandler(async(req,res,next) => {
    const { forum_id } = req.params;
    const { id } = req.user; 

    const forum = await forumServices.subscribeToForum(id, forum_id);

    return res.status(201).json({ message: 'Subscribed successfully', data: forum });
});


const unSubscribeForum = asyncErrorHandler(async(req,res,next) => {
    const { forum_id } = req.params;
    const { id } = req.user; 

    const forum = await forumServices.unSubscribeForum(id, forum_id);
    return res.status(201).json({ message: 'Unsubscribed from forum', data: forum });
});

const getForumsToSubscribe = asyncErrorHandler(async (req, res, next) => {    
    const {id} = req.user;    
    const allForums = await db.Forum.findAll({where: {isActive: true}});    
    const userForums = await db.Forum.findAll({where: {createdBy: id}});
    const subscribedForums = await db.UserMembership.findAll({where: {user_id: id}})
    
    // Convert `userForums` and `subscribedForums` into sets of forum IDs
    const userForumIds = userForums.map(forum => forum.id);
    const subscribedForumIds = subscribedForums.map(membership => membership.forum_id);

    // Filter out forums that are either created by the user or already subscribed to
    const forumsToSubscribe = allForums.filter(forum => 
        !userForumIds.includes(forum.id) && !subscribedForumIds.includes(forum.id)
    );

    return res.json({message: "subscribable forums list", data: forumsToSubscribe});
})


const getSubscribedForums = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.user;
    const subscribedForums = await db.UserMembership.findAll({where: {[Op.and] : {user_id: id}, membership_role: {[Op.ne]: 'ADMIN'}}})
    const subscribedForumIds = subscribedForums.map(membership => membership.forum_id);
    const subscribedForumsData = await Promise.all(subscribedForumIds.map(async (subscribedForum) => {
        return await db.Forum.findByPk(subscribedForum)
    }));
    
    return res.json({message: "subscribed forums list", data: subscribedForumsData});
})

const getIsSubscribed = asyncErrorHandler(async (req,res,next) => {
    const user_id = req.user.id;
    const {id} = req.params;

    const isSubscribed = await forumServices.getIsSubscribed(user_id, id);
    return res.status(200).json({isSubscribed})
})

const archiveForum = asyncErrorHandler(async (req,res,next) => {
    const userId = req.user.id;
    const {id} = req.params;
    const archivedForum = await forumServices.archiveForum(userId, id);

    return res.status(200).json({message: 'Forum archived', data: archivedForum})
})


const updateForumBanner = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const userId = req.user.id;
    const banner = req.file?.path ?? "";
    
    const forum = await forumServices.updateForumBanner(id, userId, {logo: banner});
    
    return res.status(200).json({message: 'Your banner has been updated!', forum})
});


const getForumBanner = asyncErrorHandler(async (req, res, next) => {
    const forumId = req.params.id;
    const avatarPath = await forumServices.getForumBanner(forumId);
    return res.sendFile(avatarPath);
});


const getTopicByForumId = asyncErrorHandler(async (req, res, next) => {
    const {forumId} = req.params;
    const topics = await forumServices.getTopicByForumId(forumId);
    return res.status(200).json({message: 'Fetched forum topics', data: topics})
})


const getRecentForums = asyncErrorHandler(async (req,res,next) => {
    const userId = req.user.id;
    const forums = await forumServices.getRecentForums(userId)
    return res.status(200).json({message: 'Fetched recent forums', data: forums})
})

const searchForums = asyncErrorHandler(async (req,res,next) => {
    const {forumName} = req.params;
    const forums = await forumServices.searchForums(forumName);
    return res.status(200).json({message: 'Fetched forums', data: forums})
});

export {
  getForums,
  createForum,
  getForumById,
  getForumsByCreator,
  subscribeToForum,
  getForumsToSubscribe,
  updateForum,
  getSubscribedForums,
  archiveForum,
  unSubscribeForum,
  updateForumBanner,
  getForumBanner,
  getTopicByForumId,
  getForumByForumId,
  getIsSubscribed,
  getRecentForums,
  searchForums
};