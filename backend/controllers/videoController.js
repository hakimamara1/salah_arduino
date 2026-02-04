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
 * @desc    Upload a new video
 * @access  Private/Admin
 */
export const createVideo = asyncHandler(async (req, res) => {
    const videoData = req.body;

    // Handle video upload
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a video file',
        });
    }

    const result = await uploadVideo(req.file.buffer, 'arduino-shop/videos');

    videoData.videoUrl = result.url;
    videoData.publicId = result.publicId;
    videoData.thumbnail = result.thumbnail;
    videoData.duration = result.duration;

    const video = await Video.create(videoData);

    res.status(201).json({
        success: true,
        data: video,
    });
});

/**
 * @route   PUT /api/videos/:id
 * @desc    Update a video
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

    // Handle new video upload
    if (req.file) {
        // Delete old video
        await deleteFile(video.publicId, 'video');

        const result = await uploadVideo(req.file.buffer, 'arduino-shop/videos');

        req.body.videoUrl = result.url;
        req.body.publicId = result.publicId;
        req.body.thumbnail = result.thumbnail;
        req.body.duration = result.duration;
    }

    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
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
