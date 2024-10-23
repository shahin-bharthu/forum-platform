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
            defaultValue: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        logo: {
            type: Sequelize.STRING,
            defaultValue: "https://img.favpng.com/19/25/2/chat-box-png-favpng-amR9Fi2VdFWUis7NCi48h8Lub.jpg"
        },
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            onUpdate: "cascade",
            onDelete: "cascade",
            references: { model: "users", key: "id" },
        }
    }, 
    {
        tableName:'forums',
        timeStamps: true,
        hooks: {
            beforeCreate: (forum) => {
                // Generate forum_id by replacing spaces with underscores and converting to lowercase
                forum.forum_id = forum.name.replace(/\s+/g, '_').toLowerCase();
            },
        },
    }
);

  return Forum;
};