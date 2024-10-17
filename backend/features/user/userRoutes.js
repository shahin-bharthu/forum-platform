import { Router } from 'express';

import  {updateUserDetails, getUserDetails}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';
import uploadAvatar from '../../util/uploadAvatar.js';


const router = Router();

router.get('/:id', getUserDetails)
router.put('/update', uploadAvatar.single('avatar'),validateUpdateProfile(), updateUserDetails);

export default router;