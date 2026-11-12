import express from 'express';
import passport from 'passport';
import verifyJWT from '../middlewares/auth.middleware.js'
import { loginLimiter, twoFactorLimiter } from '../middlewares/rateLimiter.js';
import { register, login, verifyTwoFactorLogin, getMe, googleCallback } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/2fa/verify', twoFactorLimiter, verifyTwoFactorLogin);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'], session: false}));
router.get('/google/callback', googleCallback);
router.get('/me', verifyJWT, getMe);

export default router;