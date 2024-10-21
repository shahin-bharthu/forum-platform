import { Router } from 'express';

import  {updateUserDetails, getUserDetails, updateUserAvatar, getAvatar}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';
import uploadAvatar from '../../util/uploadAvatar.js';
import { authMiddleware } from '../auth/authMiddleware.js';

const router = Router();

router.get('/avatar', authMiddleware, getAvatar);
router.get('/:id', getUserDetails)
router.put('/update', authMiddleware, validateUpdateProfile(), updateUserDetails);
router.put('/update/avatar/:id', uploadAvatar.single('avatar'), updateUserAvatar);

export default router;