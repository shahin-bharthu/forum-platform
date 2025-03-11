import { Router } from 'express';

import  {updateUserDetails, getUserDetails, updateUserAvatar, getAvatar, getAvatarById, getCurrentUserDetails, getUserProfileDetails}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';
import uploadAvatar from '../../util/uploadAvatar.js';

const router = Router();

router.get('/', getCurrentUserDetails);
router.get('/profile/:username', getUserProfileDetails);
router.get('/avatar', getAvatar);
router.get('/avatar/:id', getAvatarById);
router.get('/:id', getUserDetails);
router.put('/update', updateUserDetails);
router.put('/update/avatar/:id', uploadAvatar.single('avatar'), updateUserAvatar);

export default router;