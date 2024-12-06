import { Op } from "sequelize";
import { db } from "../../config/connection.js";

const createComment = async (topic_id, content, parent_comment_id, createdBy) => {
    return await db.Comment.create({
        topic_id,
        content,
        createdBy,
        parent_comment_id
    })
};

const getCommentById = async (id) => {
    return await db.Comment.findByPk(id);
}

const getCommentsByPostId = async (postId) => {
    return await db.Comment.findAll({where: {[Op.and]: {topic_id: postId, parent_comment_id: null}}});
}

const deleteComment = async (comment) => {
    return await comment.destroy();
}

const getReplies = async (parentId) => {
    return await db.Comment.findAll({where: {parent_comment_id: parentId}});
}

export { createComment, getCommentById, getCommentsByPostId, deleteComment, getReplies }