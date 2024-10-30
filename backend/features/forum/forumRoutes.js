import { Router } from 'express';
import { getForums, createForum, getForumById, getForumsByCreator, subscribeToForum } from './forumController.js';

const router = Router();

router.get('/', getForums)
router.post('/', createForum)
router.get('/my-forums', getForumsByCreator)
router.get('/:id', getForumById)
router.post('/subscribe/:forum_id', subscribeToForum);

export default router;