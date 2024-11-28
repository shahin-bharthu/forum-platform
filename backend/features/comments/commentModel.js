export default (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        topic_id: {
            type: Sequelize.STRING,
            unique: true,
            // allowNull: false
        },
        parent_comment_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    }, 
    {
        tableName:'comments',
        timeStamps: true,
    }
);

  return Comment;
};