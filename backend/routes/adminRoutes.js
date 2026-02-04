import express from 'express';
import {
    getDashboardStats,
    getRecentOrders,
    getSalesChart,
    getLowStockProducts,
    getTopProducts,
    exportOrders,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-orders', getRecentOrders);
router.get('/dashboard/sales-chart', getSalesChart);
router.get('/dashboard/low-stock', getLowStockProducts);

// Analytics routes
router.get('/analytics/top-products', getTopProducts);

// Export routes
router.get('/orders/export', exportOrders);

export default router;
