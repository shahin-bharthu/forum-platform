import { Router } from 'express';

import { userSignUp, userLogin, verifyEmail }  from './authController.js';
import { validateSignup } from './authValidator.js';

const router = Router();

router.post('/signup', validateSignup(), userSignUp)

router.post('/login', userLogin);

router.get('/verify-email/:id/:token', verifyEmail)

export default router;