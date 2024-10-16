import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./features/auth/authRoutes.js";
import userRoutes from "./features/user/userRoutes.js";
import {check} from "./config/connection.js";
import { globalErrorHandler } from "./util/globalErrorHandler.js";
import { logAuditTrails } from "./features/auditLogs/auditTrailMiddleware.js";

const port = process.env.PORT;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use(express.json());
app.use(logAuditTrails)

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use(globalErrorHandler);

try {
    await check();
    app.listen(port, () => {console.log("server started at port ", port)});
} catch (error) {
    console.error("Failed to start server");
    process.exit(1);
}