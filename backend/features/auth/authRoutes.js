import { Router } from 'express';

import { userSignUp, userLogin, verifyEmail, forgotPassword, resetPassword }  from './authController.js';
import { validateSignup, validateLogin } from './authValidator.js';

const router = Router();

router.post('/signup', validateSignup(), userSignUp)

router.post('/login', validateLogin(), userLogin);

router.get('/verify-email/:id/:token', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

export default router;