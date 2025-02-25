import { addDocumentToForumIndex, updateDocumentOfForumIndex, deleteDocumentOfForumIndex } from '../../opensearch/forums/forumIndex.js';

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
            type: Sequelize.TEXT,
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
            defaultValue: "forumLogos/defaultAvatar.png"
        },
        subscriber_count: {
            type: Sequelize.BIGINT,
            defaultValue: 1
          },
        posts_count: {
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
        hooks: {
            afterCreate: async (forum) => {
                const document = {
                    id: forum.id,
                    name: forum.name,
                    purpose: forum.purpose,
                }
                try {
                    await addDocumentToForumIndex(document);
                } catch (error) {
                    console.error(`Failed to add document to forum index: ${error.message}`);
                }
                console.log(`Forum created: ${forum.name}`);
            },
            afterUpdate: async (forum) => {
                const document = {
                    id: forum.id,
                    purpose: forum.purpose,
                }
                try {
                    await updateDocumentOfForumIndex(document);
                } catch (error) {
                    console.error(`Failed to update document of forum index: ${error.message}`);
                }
            },
            afterDestroy: async (forum) => {
                try {
                    await deleteDocumentOfForumIndex(forum.id);
                } catch (error) {
                    console.error(`Failed to delete document of forum index: ${error.message}`);
                }
            }
        }
    });

    return Forum;
};