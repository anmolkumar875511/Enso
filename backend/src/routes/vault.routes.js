import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { setup, unlock, lock } from '../controllers/vault.controller.js';

const router = express.Router();

router.post('/setup', verifyJWT, setup);
router.post('/unlock', verifyJWT, unlock);
router.post('/lock', verifyJWT, lock);

export default router;