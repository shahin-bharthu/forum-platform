import { Router } from 'express';
import { getForums, createForum, getForumById } from './forumController.js';

const router = Router();

router.get('/', getForums)
router.post('/', createForum)
router.get('/:id', getForumById)

export default router;