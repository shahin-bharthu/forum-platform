import { Router } from 'express';
import { createTopic, getTopics, getTopicById, getMyTopics, getRecentTopics, updateTopic, deleteTopic, searchTopics, archivePostById , likeTopic, unlikeTopic} from './topicController.js';
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
router.post('/like/:id', likeTopic);
router.delete('/unlike/:id', unlikeTopic);

export default router;