import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getProtectedShopData } from '../controller/shopController.js';

const router = express.Router();

router.get('/protected', authMiddleware, getProtectedShopData);

export default router;
