import express from 'express';
import {
    createOrder,
    getOrderById,
    getAllOrders,
    getMyOrders,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route (guest checkout)
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Private routes
router.get('/user/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
