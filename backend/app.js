import express from "express";
import cors from "cors";

import authRoutes from "./features/auth/authRoutes.js";
import {check} from "./config/connection.js";

const port = process.env.PORT;

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json());

app.use('/user', authRoutes);

try {
    await check();
    app.listen(port, () => {console.log("server started at port ", port)});
} catch (error) {
    console.error("Failed to start server");
    process.exit(1);
}