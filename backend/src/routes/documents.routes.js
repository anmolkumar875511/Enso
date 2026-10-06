import express from 'express';
import verifyJWT from '../middlewares/auth.middleware';
import { create, get, del } from '../controllers/document.controllers';

const router = express.Router();

router.post('/create', verifyJWT, create);
router.get('/get', verifyJWT, get);
router.delete('/del', verifyJWT, del);

export default router;