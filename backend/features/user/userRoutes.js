import { Router } from 'express';

import  {updateUserDetails}  from './userController.js';

const router = Router();

router.post('/update-user', updateUserDetails);

export default router;