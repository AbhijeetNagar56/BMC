import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
  createProduct,
  createOrder,
  getMyOrders,
  getProducts,
  getProtectedShopData,
} from '../controller/shopController.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', authMiddleware, adminMiddleware, createProduct);
router.get('/protected', authMiddleware, getProtectedShopData);
router.get('/orders/my', authMiddleware, getMyOrders);
router.post('/orders', authMiddleware, createOrder);

export default router;
