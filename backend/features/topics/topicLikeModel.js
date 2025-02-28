export default (sequelize, Sequelize) => {
    const TopicLikes = sequelize.define("topicLikes", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        topic_id: {
            type: Sequelize.UUID,
            references: {
                model: 'topics',
                key: 'id',
            },
        },
        user_id: {
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
        }
    }, 
    {
        tableName:'topic_likes',
        timeStamp: true,
    }
);
  return TopicLikes;
};