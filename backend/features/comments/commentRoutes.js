import { Router } from "express";
import { createComment } from "./commentController.js";

const router = Router();

// router.get('/', getComments);
router.post('/', createComment);

export default router;