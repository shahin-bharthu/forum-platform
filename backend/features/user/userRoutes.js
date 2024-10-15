import { Router } from 'express';

import  {updateUserDetails, getUserDetails}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';

const router = Router();

router.get('/:id', getUserDetails)
router.put('/update', validateUpdateProfile(), updateUserDetails);

export default router;