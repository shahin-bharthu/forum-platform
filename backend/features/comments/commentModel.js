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
    }
);
  return Comment;
};