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
        const forum = await db.Forum.findOne({ where: { id: forum_id } });
        
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

        await user.addForum(forum); // using sequelize's magic association method to add the forum

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

export { getForums, createForum, getForumById, getForumsByCreator, subscribeToForum }