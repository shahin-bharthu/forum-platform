export default (sequelize, Sequelize) => {
    const Topic = sequelize.define("topic", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        forum_id: {
            type: Sequelize.UUID,
            allowNull: false,
            // onUpdate: "cascade",
            // onDelete: "cascade",
            references: { model: "forums", key: "id" },
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            // onUpdate: "cascade",
            // onDelete: "cascade",
            references: { model: "users", key: "username" },
        }
    }, 
    {
        tableName:'topics',
        timeStamps: true,
    }
);

  return Topic;
};