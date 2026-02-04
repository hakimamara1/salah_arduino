import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary with optimization
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} - {url, publicId}
 */
export const uploadImage = (fileBuffer, folder = 'arduino-shop/products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' },
                    { width: 1200, height: 1200, crop: 'limit' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Upload video to Cloudinary with optimization
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Object>} - {url, publicId, thumbnail, duration}
 */
export const uploadVideo = (fileBuffer, folder = 'arduino-shop/videos') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'video',
                transformation: [
                    { quality: 'auto' },
                ],
                eager: [
                    { format: 'mp4', transformation: [{ quality: 'auto' }] },
                ],
                eager_async: true,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        thumbnail: result.secure_url.replace(/\.[^.]+$/, '.jpg'),
                        duration: result.duration,
                    });
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - 'image' or 'video'
 * @returns {Promise}
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return true;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return false;
    }
};

/**
 * Generate responsive image URL
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {String} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
    const { width = 800, height = 800, quality = 'auto', format = 'auto' } = options;

    return cloudinary.url(publicId, {
        transformation: [
            { width, height, crop: 'limit' },
            { quality, fetch_format: format },
        ],
        secure: true,
    });
};
