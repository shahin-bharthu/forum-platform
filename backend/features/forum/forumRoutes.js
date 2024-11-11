import { Router } from 'express';
import { getForums, createForum, getForumById, getForumsByCreator, subscribeToForum, getForumsToSubscribe, updateForum } from './forumController.js';

const router = Router();

router.get('/', getForums)
router.post('/', createForum)
router.get('/my-forums', getForumsByCreator)
router.get('/can-subscribe-to', getForumsToSubscribe);
router.post('/subscribe/:forum_id', subscribeToForum);
router.get('/:id', getForumById)
router.patch('/:id', updateForum)

export default router;