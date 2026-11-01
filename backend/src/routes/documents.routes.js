import express from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import { create, get, del } from '../controllers/document.controllers.js';
import upload from '../middlewares/multer.middleware.js';
import requireUnlocked from '../middlewares/requireUnlocked.js';

const router = express.Router();

router.post('/create', requireUnlocked, upload.single('file'), verifyJWT, create);
router.get('/get', verifyJWT, get);
router.delete('/del', verifyJWT, del);

export default router;