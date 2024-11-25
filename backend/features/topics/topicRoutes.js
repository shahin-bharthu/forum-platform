import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic } from './topicController.js';
import { validateTopicCreation } from './topicValidator.js';

const router = Router();

router.get('/', getTopics)
router.post('/', validateTopicCreation(), createTopic)
router.get('/my-topics', getMyTopics)
router.get('/recent-topics', getRecentTopics);
router.get('/:id', getTopicById)
router.patch('/:id', updateTopic);

export default router;