import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import * as forumServices from "./forumServices.js";
import { db } from "../../config/connection.js";
import { promises as fs } from 'fs';
import { CustomError } from "../../util/customError.js";
import path from 'path';

const createForum = asyncErrorHandler(async (req,res,next) => {
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
    
    const data = forumServices.updateForum(id, userId, body);

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

    const forum = await db.Forum.findOne({ where: { forum_id: forum_id } });
        
    if (!forum) {
        throw new CustomError('Forum not found', 404)
    }

    if (forum.createdBy === id) {
        throw new CustomError('Cannot subscribe', 500)
    }

    const existingMembership = await db.UserMembership.findOne({
        where: {
            user_id: id,
            forum_id: forum.id,
        },
    });

    if (existingMembership) {
        return res.status(409).json({ message: 'User is already subscribed to this forum' });
    }

    // increment subscriber count and save updated forum
    forum.subscriber_count += 1;
    await forum.save(); 

    // add forum to user's memberships
    const user = await db.User.findByPk(id); 

    if (!user) {
        throw new CustomError('User not found', 404)
    }

    await db.UserMembership.create({
        user_id: id,
        forum_id: forum.id,
    });

    return res.status(201).json({ message: 'Subscribed successfully', data: forum });
});


const unSubscribeForum = asyncErrorHandler(async(req,res,next) => {
    const { forum_id } = req.params;
    const { id } = req.user; 

    try {
        const forum = await db.Forum.findOne({ where: { forum_id: forum_id } });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        console.log(forum.createdBy);
        console.log(id);
        

        const user = await db.User.findByPk(id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingMembership = await db.UserMembership.findOne({
            where: {
                user_id: id,
                forum_id: forum.id,
            },
        });

        if (!existingMembership) {
            return res.status(404).json({ message: 'Subscription record does not exist', data: forum });
        }

        await existingMembership.destroy();

        forum.subscriber_count -= 1;
        await forum.save(); 

        return res.status(201).json({ message: 'Unsubscribed from forum', data: forum });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

const getForumsToSubscribe = asyncErrorHandler(async (req, res, next) => {    
    const {id} = req.user;    
    const allForums = await db.Forum.findAll();    
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
    const subscribedForums = await db.UserMembership.findAll({where: {user_id: id}})
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
    const banner = req.file?.path ?? "";
    
    const forum = await forumServices.updateForumBanner(id, {logo: banner});
    
    return res.status(200).json({message: 'Your banner has been updated!', forum})
});


//for linux
const getForumBanner = asyncErrorHandler(async (req, res, next) => {
    const forumId = req.params.id;
    const forum = await db.Forum.findByPk(forumId);
    
    const filepath = forum.logo.split('/');
    const fileName = filepath[filepath.length - 1];
    
    if (!fileName) {
      return res.status(404).json({
        status: 'failed',
        message: 'Banner not found',
      });
    } else {
      const filePath = path.join(import.meta.url.replace('file://', ''), '../../../forumLogos', fileName);
      
      try {
        await fs.access(filePath); 
        
        res.sendFile(fileName, {
          root: path.join(new URL('../../forumLogos', import.meta.url).pathname),
        });
      } catch (err) {
        return res.status(404).json({
          status: 'failed',
          message: 'Banner not found',
        });
      }
    }
});


const getTopicByForumId = asyncErrorHandler(async (req, res, next) => {
    const {forumId} = req.params;
    const topics = await forumServices.getTopicByForumId(forumId);
    return res.status(200).json({message: 'Fetched forum topics', data: topics})
})

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
  getIsSubscribed
};