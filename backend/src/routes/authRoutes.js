import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getCurrentUser, login, logout, signup } from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', logout);

export default router;
