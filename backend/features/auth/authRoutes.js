import { Router } from 'express';

import { userSignUp, userLogin, verifyEmail, forgotPassword, resetPassword, userLogout }  from './authController.js';
import { validateSignup, validateLogin } from './authValidator.js';
import { authMiddleware } from './authMiddleware.js';

const router = Router();

router.post('/signup', validateSignup(), userSignUp)

router.post('/login', validateLogin(), userLogin);

router.get('/verify-email/:id/:token', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/logout', userLogout);

export default router;