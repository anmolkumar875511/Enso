import express from 'express';
import passport from 'passport';
import verifyJWT from '../middlewares/auth.middleware.js'
import { register, login, getMe, googleCallback } from '../controllers/auth.controlles.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'], session: false}));
router.get('/google/callback', googleCallback);
router.get('/me', verifyJWT, getMe);

export default router;