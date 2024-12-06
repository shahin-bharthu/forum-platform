import { Router } from "express";
import { createComment, getCommentsByPostId, deleteComment, getReplies } from "./commentController.js";

const router = Router();

router.post('/', createComment);
router.get('/replies/:parentId', getReplies)
router.get('/:postId', getCommentsByPostId);
router.delete('/:id', deleteComment);

export default router;