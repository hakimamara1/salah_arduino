import express from 'express';
import {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes - Image upload
router.post('/upload-image', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }

        // Import cloudinary here to avoid circular dependencies
        const { v2: cloudinary } = await import('cloudinary');

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'arduino-shop/products',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                alt: req.body.alt || '',
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Image upload failed',
        });
    }
});

router.post('/', protect, admin, upload.array('images', 10), createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
