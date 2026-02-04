import express from 'express';
import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
} from '../controllers/videoController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/:id/like', likeVideo);

// Admin routes
router.post('/', protect, admin, upload.single('video'), createVideo);
router.put('/:id', protect, admin, upload.single('video'), updateVideo);
router.delete('/:id', protect, admin, deleteVideo);

export default router;
