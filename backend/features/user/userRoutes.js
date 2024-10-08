import { Router } from 'express';

import  {updateUserDetails}  from './userController.js';
import { validateUpdateProfile } from './userDetailValidator.js';

const router = Router();

router.put('/update', validateUpdateProfile(), updateUserDetails);

export default router;