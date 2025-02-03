import cron from "node-cron";
import { db } from "../config/connection.js";

const archivePost = async () => {
    cron.schedule("*/10 * * * * *", async () => {
        const allTopics = await db.Topic.findAll({ attributes: ["id"] });

        const latestCommentsPerTopic = await Promise.all(
            allTopics.map(async (topic) => {
                return await db.Comment.findAll({
                    where: { topic_id: topic.id },
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                });
            })
        );

        const olderComments = latestCommentsPerTopic.filter((comment) => {
            const commentCreatedAt = new Date(comment[0]?.createdAt).getTime();
            const currDateTime = new Date().getTime();
            const differenceInDays = Math.round(
                (currDateTime - commentCreatedAt) / (1000 * 3600 * 24)
            );
            return differenceInDays > 30;
        });

        // changing the isActive status of the topic to 0
        const archivedPosts = await Promise.all(
            olderComments.map(async (comment) => {
                const topic = await db.Topic.findByPk(comment[0].topic_id);
                topic.isActive = 0;
                await topic.save();
            })
        );
    });
};

export default archivePost;
