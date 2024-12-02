import { Router } from "express";
import { createComment, getCommentsByPostId, deleteComment, getReplies } from "./commentController.js";

const router = Router();

router.post('/', createComment);
router.get('/:postId', getCommentsByPostId);
router.delete('/:id', deleteComment);
router.get('/:parentId', getReplies)

export default router;