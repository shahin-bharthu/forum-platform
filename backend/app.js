import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./features/auth/authRoutes.js";
import userRoutes from "./features/user/userRoutes.js";
import forumRoutes from "./features/forum/forumRoutes.js";
import topicRoutes from "./features/topics/topicRoutes.js";
import commentRoutes from "./features/comments/commentRoutes.js";
import emailDigestRoutes from "./features/emailDigest/emailDigestRoutes.js";
import {check} from "./config/connection.js";
import { globalErrorHandler } from "./util/globalErrorHandler.js";
import { logAuditTrails } from "./features/auditLogs/auditTrailMiddleware.js";
import { authMiddleware } from "./features/auth/authMiddleware.js";
import client from "./lib/openSearchConnection.js";
import archivePost from "./util/archiveInactivePosts.js";
import "./features/emailDigest/emailDigestCron.js";

import { scheduleEmailDigest } from "./features/emailDigest/emailDigestCron.js";

const port = process.env.PORT;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use(express.json());
// app.use(logAuditTrails);

app.use('/auth', logAuditTrails, authRoutes);
app.use('/user', authMiddleware, logAuditTrails, userRoutes);
app.use('/forum', authMiddleware, logAuditTrails, forumRoutes);
app.use('/topic', authMiddleware, logAuditTrails, topicRoutes);
app.use('/comment', authMiddleware, logAuditTrails, commentRoutes);
app.use('/digest', authMiddleware, logAuditTrails, emailDigestRoutes );

client.info().then().catch(console.error);



archivePost();
// scheduleEmailDigest();//for manually testing the email digest
app.use(globalErrorHandler);

try {
    await check();
    app.listen(port, () => {console.log("server started at port", port)});
} catch (error) {
    console.error("Failed to start server");
    process.exit(1);
}