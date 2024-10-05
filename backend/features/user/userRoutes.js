import { Router } from 'express';
import {body, check} from 'express-validator';

import  {updateUserDetails}  from './userController.js';

const router = Router();

router.post('/update-user', updateUserDetails);

export default router;