import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import { uploadImage, deleteFile } from '../utils/cloudinaryUpload.js';

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Category filter
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Search filter
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.search, 'i')] } },
        ];
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Featured filter
    if (req.query.featured === 'true') {
        query.featured = true;
    }

    // Execute query
    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(req.query.sort || '-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
        success: true,
        data: products,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
            hasMore: skip + products.length < total,
        },
    });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('reviews.user', 'name');

    if (!product || !product.isActive) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    res.json({
        success: true,
        data: product,
    });
});

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
        .populate('category', 'name slug')
        .populate('reviews.user', 'name');

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    res.json({
        success: true,
        data: product,
    });
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
    const productData = req.body;

    // Handle image uploads if files are provided
    if (req.files && req.files.length > 0) {
        const imageUploads = await Promise.all(
            req.files.map(async (file, index) => {
                const result = await uploadImage(file.buffer, 'arduino-shop/products');
                return {
                    url: result.url,
                    publicId: result.publicId,
                    alt: productData.name,
                    isPrimary: index === 0,
                };
            })
        );
        productData.images = imageUploads;
    }

    const product = await Product.create(productData);

    res.status(201).json({
        success: true,
        data: product,
    });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
        const imageUploads = await Promise.all(
            req.files.map(async (file, index) => {
                const result = await uploadImage(file.buffer, 'arduino-shop/products');
                return {
                    url: result.url,
                    publicId: result.publicId,
                    alt: req.body.name || product.name,
                    isPrimary: index === 0 && (!req.body.images || req.body.images.length === 0),
                };
            })
        );

        // Merge with existing images if keepExisting flag is set
        if (req.body.keepExistingImages === 'true') {
            req.body.images = [...product.images, ...imageUploads];
        } else {
            req.body.images = imageUploads;
        }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json({
        success: true,
        data: product,
    });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
        await Promise.all(
            product.images.map((image) => deleteFile(image.publicId, 'image'))
        );
    }

    await product.deleteOne();

    res.json({
        success: true,
        message: 'Product deleted successfully',
    });
});

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Add product review
 * @access  Private
 */
export const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        return res.status(400).json({
            success: false,
            message: 'Product already reviewed',
        });
    }

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    product.reviews.push(review);
    product.updateRating();

    await product.save();

    res.status(201).json({
        success: true,
        message: 'Review added successfully',
    });
});
