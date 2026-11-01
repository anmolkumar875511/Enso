import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { create, get, del } from '../controllers/document.controllers.js';
import upload from '../middlewares/multer.middleware.js';
import requireUnlocked from '../middlewares/requireUnlocked.js';

const router = express.Router();

router.post('/create', verifyJWT, requireUnlocked, upload.single('file'), create);
router.get('/get', verifyJWT, requireUnlocked, get);
router.delete('/del', verifyJWT, requireUnlocked, del);

export default router;