import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/Category.js';
import { uploadImage, deleteFile } from '../utils/cloudinaryUpload.js';

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .populate('parent', 'name slug')
        .sort('order name');

    res.json({
        success: true,
        data: categories,
    });
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category
 * @access  Public
 */
export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('parent', 'name slug');

    if (!category || !category.isActive) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    res.json({
        success: true,
        data: category,
    });
});

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
    const categoryData = req.body;

    // Handle image upload
    if (req.file) {
        const result = await uploadImage(req.file.buffer, 'arduino-shop/categories');
        categoryData.image = {
            url: result.url,
            publicId: result.publicId,
            alt: categoryData.name,
        };
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
        success: true,
        data: category,
    });
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    // Handle new image upload
    if (req.file) {
        // Delete old image if exists
        if (category.image && category.image.publicId) {
            await deleteFile(category.image.publicId, 'image');
        }

        const result = await uploadImage(req.file.buffer, 'arduino-shop/categories');
        req.body.image = {
            url: result.url,
            publicId: result.publicId,
            alt: req.body.name || category.name,
        };
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json({
        success: true,
        data: category,
    });
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    // Delete image from Cloudinary
    if (category.image && category.image.publicId) {
        await deleteFile(category.image.publicId, 'image');
    }

    await category.deleteOne();

    res.json({
        success: true,
        message: 'Category deleted successfully',
    });
});
