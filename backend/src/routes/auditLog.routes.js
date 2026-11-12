import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { list } from '../controllers/auditLog.controller.js';

const router = express.Router();

router.get('/', verifyJWT, list);

export default router;