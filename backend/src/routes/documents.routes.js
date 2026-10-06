import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { create, get, del } from '../controllers/document.controllers.js';

const router = express.Router();

router.post('/create', verifyJWT, create);
router.get('/get', verifyJWT, get);
router.delete('/del', verifyJWT, del);

export default router;