import { addDocumentToTopicIndex, updateDocumentOfTopicIndex, deleteDocumentOfTopicIndex } from "../../opensearch/topics/topicIndex.js";

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
        likes_count: {
            type: Sequelize.BIGINT,
            defaultValue: 0
        },
        createdBy: {
            type: Sequelize.UUID,
            allowNull: false,
            // onUpdate: "cascade",
            // onDelete: "cascade",
            references: { model: "users", key: "id" },
        }
    },
        {
            tableName: 'topics',
            timeStamps: true,
            hooks: {
                afterCreate: async (topic) => {
                    const document = {
                        id: topic.id,
                        title: topic.title,
                        content: topic.content,
                    }
                    try {
                        await addDocumentToTopicIndex(document);
                    } catch (error) {
                        console.error(`Failed to add document to topic index: ${error.message}`);
                    }
                    console.log(`Topic created: ${topic.id}`);
                },
                afterUpdate: async (topic) => {
                    if (!topic.changed('content')) {
                        return;
                    }
                    const document = {
                        id: topic.id,
                        title: topic.title,
                        content: topic.content,
                    }
                    try {
                        await updateDocumentOfTopicIndex(document);
                        console.log(`Topic updated: ${topic.id}`);
                    } catch (error) {
                        console.error(`Failed to add document to topic index: ${error.message}`);
                    }
                },
                afterDestroy: async (topic) => {
                    try {
                        await deleteDocumentOfTopicIndex(topic.id);
                        console.log(`Topic deleted: ${topic.id}`);
                    } catch (error) {
                        console.error(`Failed to delete document from topic index: ${error.message}`);
                    }
                }
            }
        }
    );

    return Topic;
};