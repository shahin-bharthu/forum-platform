import { db } from "../../config/connection.js"

const createComment = async (topic_id, content, parent_comment_id, createdBy) => {
    return await db.Comment.create({
        topic_id,
        content,
        createdBy,
        parent_comment_id
    })
};

const getCommentsByPostId = async (postId) => {
    return await db.Comment.findAll({where: {topic_id: postId}});
}

export { createComment, getCommentsByPostId }