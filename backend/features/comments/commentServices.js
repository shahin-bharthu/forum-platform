import * as commentRepository from './commentRepository.js';
import * as topicRepository from '../topics/topicRepository.js';
import * as forumRepository from '../forum/forumRepository.js';
import { CustomError } from "../../util/customError.js";
import { searchCommentIndex } from '../../opensearch/comments/commentIndex.js';

const createComment = async (topic_id, content, parent_comment_id, createdBy) => {
    const {forum} = await topicRepository.getTopicById(topic_id);
    const comment_content = content.trim();
    if (forum.isActive) {
        return await commentRepository.createComment(topic_id, comment_content, parent_comment_id, createdBy);
    }
    else {
        throw new CustomError("Cannot add comments to the post of an archived forum", 403);
    }
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


const searchComments = async(searchText, userId) => {
    const results = await searchCommentIndex(searchText);
    const commentData = await Promise.all(results.map(async (result) => {
        const comment = await commentRepository.getCommentById(result._source.id);
        if (!comment) {
            throw new CustomError("Comment not found", 404);
        }
        if (comment.forum.isActive === false) {
            return [];
        }
        if(comment.forum.isPublic === false) {
            const membership = await forumRepository.getIsSubscribed(userId, comment.forum.id);
            if (!membership) {
                return [];
            }
        }
        return [{
            id: comment.id,
            topic_id: comment.topic.id,
            forum_id: comment.forum.id
        }];
    }));
    return commentData.flat();
}


export { createComment, getCommentsByPostId, deleteComment, getReplies, searchComments }