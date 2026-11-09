import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { setup, unlock, lock, status} from '../controllers/vault.controller.js';

const router = express.Router();

router.post('/setup', verifyJWT, setup);
router.post('/unlock', verifyJWT, unlock);
router.post('/lock', verifyJWT, lock);
router.get('/status', verifyJWT, status);

export default router;