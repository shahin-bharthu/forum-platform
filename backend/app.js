import express from "express";

import authRoutes from "./features/auth/authRoutes.js";
import {check} from "./config/connection.js";

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/user', authRoutes);

check();

app.listen(port, () => {console.log("server started at port ", port)});