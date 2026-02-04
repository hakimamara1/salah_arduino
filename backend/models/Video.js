import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Video title is required'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Video description is required'],
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        // Cloudinary video data
        videoUrl: {
            type: String,
            required: [true, 'Video URL is required'],
        },
        publicId: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        duration: {
            type: Number, // in seconds
        },
        category: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'tutorial', 'project', 'review'],
            default: 'tutorial',
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        relatedProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create slug from title before saving
videoSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
