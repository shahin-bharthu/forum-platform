import { Router } from 'express';
import {
  getForums,
  createForum,
  getForumById,
  getForumsByCreator,
  subscribeToForum,
  unSubscribeForum,
  getForumsToSubscribe,
  updateForum,
  getSubscribedForums,
  archiveForum,
  updateForumBanner,
  getForumBanner,
  getTopicByForumId
} from "./forumController.js";
import upload from '../../util/uploadForumBanner.js';

const router = Router();

router.get('/', getForums);
router.post('/', createForum);
router.get('/my-forums', getForumsByCreator);
router.get('/subscribed-forums', getSubscribedForums);
router.get('/can-subscribe-to', getForumsToSubscribe);
router.patch('/archive/:id', archiveForum);
router.post('/subscribe/:forum_id', subscribeToForum);
router.post('/unsubscribe/:forum_id', unSubscribeForum);
router.get('/topics/:forumId', getTopicByForumId);
router.get('/:id', getForumById);
router.patch('/:id', updateForum);
router.put('/banner/:id', upload.single('banner'), updateForumBanner);
router.get('/banner/:id', getForumBanner);


export default router;