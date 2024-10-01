import { Router } from 'express';

import  {userSignUp}  from './authController.js';

const router = Router();

router.post('/signup', userSignUp);

export default router;