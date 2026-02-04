import multer from 'multer';
import path from 'path';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|avi|mov|wmv|webm/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    const isImage = allowedImageTypes.test(extname) && mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && mimetype.startsWith('video/');

    if (isImage || isVideo) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
    },
    fileFilter: fileFilter,
});

export default upload;
