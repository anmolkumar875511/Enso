import express from 'express';
import verifyJWT from "../middlewares/auth.middleware";
import { setup, enable, disable } from '../controllers/twofactor.controller.js';

const router = express.Router();

router.post('/setup', verifyJWT, setup);
router.post('/enable', verifyJWT, enable);
router.post('/disable', verifyJWT, disable);

export default router;