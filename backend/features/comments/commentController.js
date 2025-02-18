import { validationResult } from "express-validator";
import * as commentServices from "./commentServices.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";

const createComment = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const createdBy = req.user.id
    const {topic_id, content, parent_comment_id} = req.body;
    const comment = await commentServices.createComment(topic_id, content, parent_comment_id, createdBy);
    
    return res.status(201).json({message: "Comment created successfully", data: comment});
})


const getCommentsByPostId = asyncErrorHandler(async (req,res,next) => {
    const {postId} = req.params;
    const comments = await commentServices.getCommentsByPostId(postId);

    return res.status(200).json({message: `Comments for post id ${postId} fetched successfully`, data: comments});
})


const deleteComment = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const comment = await commentServices.deleteComment(id);

    return res.status(200).json({message: `Comment deleted successfully`, data: comment});
})


const getReplies = asyncErrorHandler(async (req,res,next) => {
    const {parentId} = req.params;
    const replies = await commentServices.getReplies(parentId);

    return res.status(200).json({message: `Replies fetched successfully`, data: replies});
})


const searchComments = asyncErrorHandler(async (req,res,next) => {
    const {searchText} = req.params;
    const {id} = req.user;
    const comments = await commentServices.searchComments(searchText, id);
    return res.status(200).json({message: `Fetched comments`, data: comments})
});

export { createComment, getCommentsByPostId, deleteComment, getReplies, searchComments }