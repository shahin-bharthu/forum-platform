import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics } from './topicController.js';

const router = Router();

router.get('/', getTopics)
router.post('/', createTopic)
router.get('/my-topics', getMyTopics)
router.get('/:id', getTopicById)

export default router;