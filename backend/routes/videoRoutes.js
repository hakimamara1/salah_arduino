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

// Admin route - Video upload with Cloudinary optimization
router.post('/upload', protect, admin, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided',
            });
        }

        // Import cloudinary here
        const { v2: cloudinary } = await import('cloudinary');

        // Upload to Cloudinary with video optimizations
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'arduino-shop/videos',
                    resource_type: 'video',
                    // Cloudinary video optimizations
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ],
                    // Generate multiple quality versions for different devices
                    eager: [
                        {
                            width: 1280,
                            height: 720,
                            crop: 'limit',
                            quality: 'auto:best',
                            format: 'mp4',
                            video_codec: 'h264'
                        },
                        {
                            width: 854,
                            height: 480,
                            crop: 'limit',
                            quality: 'auto:good',
                            format: 'mp4',
                            video_codec: 'h264'
                        },
                        {
                            width: 640,
                            height: 360,
                            crop: 'limit',
                            quality: 'auto:eco',
                            format: 'mp4',
                            video_codec: 'h264'
                        }
                    ],
                    eager_async: true, // Process transformations asynchronously
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Format duration from seconds to MM:SS or HH:MM:SS
        const formatDuration = (seconds) => {
            if (!seconds) return null;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        };

        res.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                duration: formatDuration(result.duration),
                format: result.format,
                width: result.width,
                height: result.height,
            },
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Video upload failed',
        });
    }
});

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/:id/like', likeVideo);

// Admin routes
router.post('/', protect, admin, createVideo);
router.put('/:id', protect, admin, updateVideo);
router.delete('/:id', protect, admin, deleteVideo);

export default router;
