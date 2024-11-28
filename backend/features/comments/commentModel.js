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
            type: Sequelize.STRING,
            defaultValue: true
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