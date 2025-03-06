import { addDocumentToCommentIndex, updateDocumentOfCommentIndex, deleteDocumentOfCommentIndex } from "../../opensearch/comments/commentIndex.js";

export default (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        topic_id: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: { model: "topics", key: "id" },
        },
        parent_comment_id: {
            type: Sequelize.UUID,
            references: { model: "comments", key: "id" }
        },
        content: {
            type: Sequelize.TEXT,
            defaultValue: true
        },
        likes_count: {
            type: Sequelize.BIGINT,
            defaultValue: 0
        },
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: { model: "users", key: "id" },
        },
    }, 
    {
        tableName:'comments',
        timeStamps: true,
        hooks: {
                afterCreate: async (comment) => {
                    const document = {
                            id: comment.id,
                            content: comment.content,
                    }
                    try {
                        await addDocumentToCommentIndex(document);
                    } catch (error) {
                        console.error(`Failed to add document to comment index: ${error.message}`);
                    }
                    console.log(`Comment created: ${comment.id}`);
                },
                afterUpdate: async (comment) => {    
                    const document = {
                        id: comment.id,
                        content: comment.content,
                    }
                    try {
                        await updateDocumentOfCommentIndex(document);
                    } catch (error) {
                        console.error(`Failed to update document in comment index: ${error.message}`);
                    }
                    console.log(`Comment updated: ${comment.id}`);
                },
                afterDestroy: async (comment) => {
                    try {
                        await deleteDocumentOfCommentIndex(comment.id);
                        console.log(`Comment deleted: ${comment.id}`);
                    } catch (error) {
                        console.error(`Failed to delete document from comment index: ${error.message}`);
                    }
                }
    }
});
  return Comment;
};