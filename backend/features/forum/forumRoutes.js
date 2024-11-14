import { Router } from 'express';
import { getForums, createForum, getForumById, getForumsByCreator, subscribeToForum, unSubscribeForum, getForumsToSubscribe, updateForum, getSubscribedForums, archiveForum } from './forumController.js';

const router = Router();

router.get('/', getForums)
router.post('/', createForum)
router.get('/my-forums', getForumsByCreator)
router.get('/subscribed-forums', getSubscribedForums);
router.get('/can-subscribe-to', getForumsToSubscribe);
router.patch('/archive/:id', archiveForum)
router.post('/subscribe/:forum_id', subscribeToForum);
router.post('/unsubscribe/:forum_id', unSubscribeForum);
router.get('/:id', getForumById)
router.patch('/:id', updateForum)

export default router;