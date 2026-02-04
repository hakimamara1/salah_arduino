import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Get total revenue from delivered orders
    const revenueResult = await Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const revenue = revenueResult[0]?.total || 0;

    // Get total orders count
    const ordersCount = await Order.countDocuments();

    // Get total products count
    const productsCount = await Product.countDocuments();

    // Get total users count
    const usersCount = await User.countDocuments({ role: 'customer' });

    res.json({
        revenue,
        orders: ordersCount,
        products: productsCount,
        users: usersCount,
    });
});

// @desc    Get recent orders
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private/Admin
export const getRecentOrders = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('orderNumber customer status totalPrice createdAt');

    res.json({ data: orders });
});

// @desc    Get sales chart data
// @route   GET /api/admin/dashboard/sales-chart
// @access  Private/Admin
export const getSalesChart = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                status: { $in: ['delivered', 'processing', 'shipped'] },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                totalSales: { $sum: '$totalPrice' },
                orderCount: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.json({ data: salesData });
});

// @desc    Get low stock products
// @route   GET /api/admin/dashboard/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
    const threshold = parseInt(req.query.threshold) || 10;

    const products = await Product.find({ stock: { $lte: threshold } })
        .sort({ stock: 1 })
        .select('name sku stock price')
        .limit(20);

    res.json({ data: products });
});

// @desc    Get top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
export const getTopProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await Order.aggregate([
        { $match: { status: { $in: ['delivered', 'processing', 'shipped'] } } },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.product',
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $project: {
                name: '$product.name',
                totalQuantity: 1,
                totalRevenue: 1,
                image: { $arrayElemAt: ['$product.images.url', 0] },
            },
        },
    ]);

    res.json({ data: topProducts });
});

// @desc    Export orders to CSV
// @route   GET /api/admin/orders/export
// @access  Private/Admin
export const exportOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('items.product', 'name sku');

    // Simple CSV generation
    const csvHeader = 'Order Number,Customer Name,Email,Phone,Status,Total,Date\n';
    const csvRows = orders.map(order => {
        return `${order.orderNumber},${order.customer.name},${order.customer.email},${order.customer.phone},${order.status},${order.totalPrice},${order.createdAt.toISOString()}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csv);
});
