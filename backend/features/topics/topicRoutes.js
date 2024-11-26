import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic } from './topicController.js';
import { validateTopicCreation, validateTopicUpdate } from './topicValidator.js';

const router = Router();

router.get('/', getTopics)
router.post('/', validateTopicCreation(), createTopic)
router.get('/my-topics', getMyTopics)
router.get('/recent-topics', getRecentTopics);
router.get('/:id', getTopicById)
router.patch('/:id', validateTopicUpdate(), updateTopic);
router.delete('/:id', deleteTopic);

export default router;