import { Router } from 'express';

import  {updateUserDetails, getUserDetails, updateUserAvatar, getAvatar}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';
import uploadAvatar from '../../util/uploadAvatar.js';

const router = Router();

router.get('/avatar', getAvatar);
router.get('/:id', getUserDetails)
router.put('/update', updateUserDetails);
router.put('/update/avatar/:id', uploadAvatar.single('avatar'), updateUserAvatar);

export default router;