import * as commentRepository from './commentRepository.js';
import { CustomError } from "../../util/customError.js";

const createComment = async (topic_id, content, parent_comment_id, createdBy) => {
    return await commentRepository.createComment(topic_id, content, parent_comment_id, createdBy);
}

const getCommentsByPostId = async (postId) => {
    return await commentRepository.getCommentsByPostId(postId);
}

const deleteComment = async (id) => {
    const comment = await commentRepository.getCommentById(id);

    if (!comment) {
        throw new CustomError("Couldn't delete comment", 404);
    }

    return await commentRepository.deleteComment(comment);
}

const getReplies = async (parentId) => {
    const comment = await commentRepository.getCommentById(parentId);

    if (!comment) {
        throw new CustomError("Comment with given parent id not found", 404);
    }

    return await commentRepository.getReplies(parentId);
}

export { createComment, getCommentsByPostId, deleteComment, getReplies }