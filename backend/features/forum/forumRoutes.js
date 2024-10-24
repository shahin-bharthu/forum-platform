import { Router } from 'express';
import { getForums, createForum, getForumById, getForumsByCreator } from './forumController.js';

const router = Router();

router.get('/', getForums)
router.post('/', createForum)
router.get('/my-forums', getForumsByCreator)
router.get('/:id', getForumById)

export default router;