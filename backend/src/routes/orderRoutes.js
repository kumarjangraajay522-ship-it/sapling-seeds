import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Publicly available within authenticated group
router.post('/', authenticateToken, addOrderItems);
router.get('/myorders', authenticateToken, getMyOrders);
router.get('/:id', authenticateToken, getOrderById);

// Admin only routes
router.get('/', authenticateToken, authorizeAdmin, getOrders);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus);

export default router;
