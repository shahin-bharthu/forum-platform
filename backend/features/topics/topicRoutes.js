import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics } from './topicController.js';

const router = Router();

router.get('/', getTopics)
router.post('/', createTopic)
router.get('/my-topics', getMyTopics)
router.get('/recent-topics', getRecentTopics);
router.get('/:id', getTopicById)

export default router;