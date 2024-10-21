import { Router } from 'express';

import  {updateUserDetails, getUserDetails, updateUserAvatar}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';
import uploadAvatar from '../../util/uploadAvatar.js';

const router = Router();

router.get('/:id', getUserDetails)
router.put('/update',validateUpdateProfile(), updateUserDetails);
router.put('/update/avatar', uploadAvatar.single('avatar'), updateUserAvatar);


export default router;