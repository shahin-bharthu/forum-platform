import { Router } from 'express';
import {
  getForums,
  createForum,
  getForumById,
  getForumsByCreator,
  getMyForums,
  subscribeToForum,
  unSubscribeForum,
  getForumsToSubscribe,
  updateForum,
  getSubscribedForums,
  archiveForum,
  updateForumBanner,
  getForumBanner,
  getTopicByForumId,
  getForumByForumId,
  getIsSubscribed,
  getRecentForums,
  searchForums,
  createForums
} from "./forumController.js";
import { validateForumCreation } from './forumValidator.js';
import upload from '../../util/uploadForumBanner.js';

const router = Router();

router.get('/', getForums);
router.post('/', validateForumCreation(), createForum);
router.post('/create-forums', validateForumCreation(), createForums);
router.get('/my-forums', getMyForums);
router.get('/subscribed-forums', getSubscribedForums);
router.get('/can-subscribe-to', getForumsToSubscribe);
router.patch('/archive/:id', archiveForum);
router.post('/subscribe/:forum_id', subscribeToForum);
router.post('/unsubscribe/:forum_id', unSubscribeForum);
router.get('/recent-forums', getRecentForums);
router.get('/is-subscribed/:id', getIsSubscribed)
router.get('/topics/:forumId', getTopicByForumId);
router.get('/:id', getForumById);
router.get('/forum-id/:id', getForumByForumId)
router.patch('/:id', updateForum);
router.put('/banner/:id', upload.single('banner'), updateForumBanner);
router.get('/banner/:id', getForumBanner);
router.get('/search/:forumName', searchForums);

export default router;