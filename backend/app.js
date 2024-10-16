import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from "./features/auth/authRoutes.js";
import userRoutes from "./features/user/userRoutes.js";
import {check} from "./config/connection.js";
import { globalErrorHandler } from "./util/globalErrorHandler.js";

const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use(express.json());

app.use(morgan('combined', { stream: accessLogStream }));

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