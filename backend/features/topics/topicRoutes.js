import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics, archivePostById } from './topicController.js';
import { validateTopicCreation, validateTopicUpdate } from './topicValidator.js';

const router = Router();

router.get('/', getTopics);
router.post('/', validateTopicCreation(), createTopic);
router.get('/my-topics', getMyTopics);
router.get('/recent-topics', getRecentTopics);
router.post('/archive/:id', archivePostById);
router.get('/:id', getTopicById)
router.patch('/:id', validateTopicUpdate(), updateTopic);
router.delete('/:id', deleteTopic);
router.get('/search/:topicQuery', searchTopics);

export default router;