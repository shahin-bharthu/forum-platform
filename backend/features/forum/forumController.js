import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import * as forumServices from "./forumServices.js";
import { db } from "../../config/connection.js";

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

const updateForum = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const userId = req.user.id;
    const body = req.body;
    const data = forumServices.updateForum(id, userId, body);

    return res.status(200).json({message: "Forum details have been updated successfully", data: data});
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

const subscribeToForum = asyncErrorHandler(async(req,res,next) => {
    const { forum_id } = req.params;
    const { id } = req.user; 

    try {
        const forum = await db.Forum.findOne({ where: { forum_id: forum_id } });
        
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
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
            return res.status(404).json({ message: 'User not found' });
        }

        // await user.addForum(forum); // using sequelize's magic association method to add the forum

        await db.UserMembership.create({
            user_id: id,
            forum_id: forum.id,
        });

        return res.status(201).json({ message: 'Subscribed successfully', data: forum });
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

export { getForums, createForum, getForumById, getForumsByCreator, subscribeToForum, getForumsToSubscribe, updateForum, getSubscribedForums }