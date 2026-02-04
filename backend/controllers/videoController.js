import asyncHandler from '../middleware/asyncHandler.js';
import Video from '../models/Video.js';
import { uploadVideo, deleteFile } from '../utils/cloudinaryUpload.js';

/**
 * @route   GET /api/videos
 * @desc    Get all videos with filtering
 * @access  Public
 */
export const getVideos = asyncHandler(async (req, res) => {
    const query = { isActive: true };

    // Filter by category
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Search filter
    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
            { tags: { $in: [new RegExp(req.query.search, 'i')] } },
        ];
    }

    // Featured filter
    if (req.query.featured === 'true') {
        query.featured = true;
    }

    const videos = await Video.find(query)
        .populate('relatedProducts', 'name price images slug')
        .sort(req.query.sort || '-createdAt');

    res.json({
        success: true,
        data: videos,
    });
});

/**
 * @route   GET /api/videos/:id
 * @desc    Get single video and increment views
 * @access  Public
 */
export const getVideoById = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id).populate(
        'relatedProducts',
        'name price images slug'
    );

    if (!video || !video.isActive) {
        return res.status(404).json({
            success: false,
            message: 'Video not found',
        });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json({
        success: true,
        data: video,
    });
});

/**
 * @route   POST /api/videos
 * @desc    Create a new video with pre-uploaded files
 * @access  Private/Admin
 */
export const createVideo = asyncHandler(async (req, res) => {
    const { title, description, category, difficulty, duration, video, thumbnail } = req.body;

    // Validate required fields
    if (!title || !category || !video || !thumbnail) {
        return res.status(400).json({
            success: false,
            message: 'Please provide title, category, video, and thumbnail',
        });
    }

    // Create video document
    const videoData = {
        title,
        description,
        category,
        difficulty: difficulty || 'beginner',
        duration,
        videoUrl: video.url,
        publicId: video.publicId,
        thumbnail,
        isActive: true,
    };

    const newVideo = await Video.create(videoData);

    res.status(201).json({
        success: true,
        data: newVideo,
    });
});

/**
 * @route   PUT /api/videos/:id
 * @desc    Update a video with pre-uploaded files
 * @access  Private/Admin
 */
export const updateVideo = asyncHandler(async (req, res) => {
    let video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({
            success: false,
            message: 'Video not found',
        });
    }

    const { title, description, category, difficulty, duration, video: videoFile, thumbnail } = req.body;

    // Build update object
    const updateData = {
        title: title || video.title,
        description: description !== undefined ? description : video.description,
        category: category || video.category,
        difficulty: difficulty || video.difficulty,
        duration: duration || video.duration,
    };

    // Update video URL if new video provided
    if (videoFile && videoFile.url) {
        // Optional: Delete old video from Cloudinary
        if (video.publicId) {
            try {
                await deleteFile(video.publicId, 'video');
            } catch (error) {
                console.warn('Could not delete old video:', error.message);
            }
        }
        updateData.videoUrl = videoFile.url;
        updateData.publicId = videoFile.publicId;
    }

    // Update thumbnail if new one provided
    if (thumbnail && thumbnail.url) {
        updateData.thumbnail = thumbnail;
    }

    video = await Video.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    });

    res.json({
        success: true,
        data: video,
    });
});

/**
 * @route   DELETE /api/videos/:id
 * @desc    Delete a video
 * @access  Private/Admin
 */
export const deleteVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({
            success: false,
            message: 'Video not found',
        });
    }

    // Delete video from Cloudinary
    await deleteFile(video.publicId, 'video');

    await video.deleteOne();

    res.json({
        success: true,
        message: 'Video deleted successfully',
    });
});

/**
 * @route   POST /api/videos/:id/like
 * @desc    Like a video
 * @access  Public
 */
export const likeVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) {
        return res.status(404).json({
            success: false,
            message: 'Video not found',
        });
    }

    video.likes += 1;
    await video.save();

    res.json({
        success: true,
        data: { likes: video.likes },
    });
});
