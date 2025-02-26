import { Router } from "express";
import { createComment, getCommentsByPostId, deleteComment, getReplies, searchComments, getCommentById } from "./commentController.js";

const router = Router();

router.post('/', createComment);
router.get('/id/:id', getCommentById)
router.get('/replies/:parentId', getReplies);
router.get('/:postId', getCommentsByPostId);
router.get('/search/:searchText', searchComments);
router.delete('/:id', deleteComment);

export default router;