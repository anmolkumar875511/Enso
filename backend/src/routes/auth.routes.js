import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js'
import { register, login, getMe } from '../controllers/auth.controlles.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyJWT, getMe);

export default router;