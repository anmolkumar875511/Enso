import express from 'express';
import verifyJWT from "../middlewares/auth.middleware.js";
import { twoFactorLimiter } from '../middlewares/rateLimiter.js';
import { setup, enable, disable } from '../controllers/twofactor.controller.js';

const router = express.Router();

router.post('/setup', verifyJWT, setup);
router.post('/enable', twoFactorLimiter, verifyJWT, enable);
router.post('/disable', twoFactorLimiter, verifyJWT, disable);

export default router;