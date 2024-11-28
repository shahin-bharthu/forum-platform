import * as commentRepository from './commentRepository.js';

const createComment = async (topic_id, content, parent_comment_id, createdBy) => {
    return await commentRepository.createComment(topic_id, content, parent_comment_id, createdBy);
}

export { createComment }