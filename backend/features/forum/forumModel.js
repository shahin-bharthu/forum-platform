export default (sequelize, Sequelize) => {
    const Forum = sequelize.define("forum", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        forum_id: {
            type: Sequelize.STRING,
            unique: true,
            // allowNull: false
        },
        purpose: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isPublic: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        logo: {
            type: Sequelize.STRING,
            defaultValue: "https://blog.cengage.com/wp-content/uploads/2023/11/tl-discussion-boards-1551827-1024x351.png"
        },
        subscriber_count: {
            type: Sequelize.BIGINT,
            defaultValue: 1
          },        
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            // onUpdate: "cascade",
            onDelete: "cascade",
            references: { model: "users", key: "id" },
        }
    }, 
    {
        tableName:'forums',
        timeStamps: true,
        // hooks: {
        //     beforeCreate: (forum) => {
        //         // Generate forum_id by replacing spaces with underscores and converting to lowercase
        //         forum.forum_id = forum.name.replace(/\s+/g, '_').toLowerCase();
        //     },
        // },
    }
);

  return Forum;
};