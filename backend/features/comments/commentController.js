import { validationResult } from "express-validator";
import * as commentServices from "./commentServices.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";

const createComment = asyncErrorHandler(async (req,res,next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(422).json({ errors: errors.array() });
    // }
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


export { createComment, getCommentsByPostId }