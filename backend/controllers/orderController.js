import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @route   POST /api/orders
 * @desc    Create a new order (COD only)
 * @access  Public
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { customer, items, shippingAddress, notes, shippingPrice } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No order items provided',
        });
    }

    // Calculate prices and validate stock
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product ${item.product} not found`,
            });
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${product.name}`,
            });
        }

        const orderItem = {
            product: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0].url : '',
            price: product.price,
            quantity: item.quantity,
        };

        orderItems.push(orderItem);
        itemsPrice += product.price * item.quantity;

        // Update product stock
        product.stock -= item.quantity;
        await product.save();
    }

    const totalPrice = itemsPrice + (shippingPrice || 0);

    const order = await Order.create({
        customer,
        userId: req.user ? req.user._id : undefined,
        items: orderItems,
        shippingAddress,
        paymentMethod: 'COD',
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        totalPrice,
        notes,
    });

    res.status(201).json({
        success: true,
        data: order,
    });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Public (for tracking) / Private (for user orders)
 */
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('items.product', 'name');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    // If user is logged in, check if they own the order or are admin
    if (req.user) {
        if (
            order.userId?.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }
    }

    res.json({
        success: true,
        data: order,
    });
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status
    if (req.query.status) {
        query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name');

    const total = await Order.countDocuments(query);

    res.json({
        success: true,
        data: orders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total,
        },
    });
});

/**
 * @route   GET /api/orders/user/my-orders
 * @desc    Get logged in user orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id })
        .sort('-createdAt')
        .populate('items.product', 'name');

    res.json({
        success: true,
        data: orders,
    });
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus, trackingNumber, cancellationReason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    order.orderStatus = orderStatus || order.orderStatus;

    if (trackingNumber) {
        order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'paid';
    }

    if (orderStatus === 'cancelled') {
        order.cancelledAt = Date.now();
        order.cancellationReason = cancellationReason;

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }
    }

    await order.save();

    res.json({
        success: true,
        data: order,
    });
});
