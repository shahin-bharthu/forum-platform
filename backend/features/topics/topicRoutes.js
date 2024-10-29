import { Router } from 'express';
import { createTopic, getTopics } from './topicController.js';

const router = Router();

router.get('/', getTopics)
router.post('/', createTopic)
// router.get('/my-forums', getForumsByCreator)
// router.get('/:id', getForumById)

export default router;