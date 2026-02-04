import React, { useState } from 'react';
import api from '../../services/api';

const VideoUploader = ({ video, thumbnail, onVideoChange, onThumbnailChange }) => {
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [thumbnailProgress, setThumbnailProgress] = useState(0);

    const handleVideoSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file');
            return;
        }

        setUploadingVideo(true);
        setVideoProgress(0);

        try {
            const formData = new FormData();
            formData.append('video', file);

            const response = await api.post('/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setVideoProgress(percentCompleted);
                },
            });

            onVideoChange(response.data.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload video');
        } finally {
            setUploadingVideo(false);
            setVideoProgress(0);
            e.target.value = '';
        }
    };

    const handleThumbnailSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        setUploadingThumbnail(true);
        setThumbnailProgress(0);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/products/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setThumbnailProgress(percentCompleted);
                },
            });

            onThumbnailChange(response.data.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload thumbnail');
        } finally {
            setUploadingThumbnail(false);
            setThumbnailProgress(0);
            e.target.value = '';
        }
    };

    return (
        <div style={styles.container}>
            {/* Video Upload */}
            <div style={styles.uploadSection}>
                <h3 style={styles.label}>Video File *</h3>
                <div style={styles.uploadArea}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        style={styles.fileInput}
                        id="video-upload"
                        disabled={uploadingVideo}
                    />
                    <label htmlFor="video-upload" style={styles.uploadLabel}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        <span style={styles.uploadText}>
                            {uploadingVideo
                                ? `Uploading Video... ${videoProgress}%`
                                : video
                                    ? 'Click to change video'
                                    : 'Click to upload video'}
                        </span>
                        <span style={styles.uploadHint}>
                            MP4, WebM, MOV up to 100MB
                        </span>
                    </label>
                </div>

                {video && (
                    <div style={styles.preview}>
                        <video
                            src={video.url}
                            controls
                            style={styles.videoPreview}
                        />
                        <div style={styles.videoInfo}>
                            <p style={styles.infoText}>
                                <strong>URL:</strong> {video.url}
                            </p>
                            {video.duration && (
                                <p style={styles.infoText}>
                                    <strong>Duration:</strong> {video.duration}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={() => onVideoChange(null)}
                                className="btn btn-sm"
                                style={{ backgroundColor: 'var(--color-error)', color: 'white', marginTop: 'var(--spacing-sm)' }}
                            >
                                Remove Video
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Thumbnail Upload */}
            <div style={styles.uploadSection}>
                <h3 style={styles.label}>Thumbnail Image *</h3>
                <div style={styles.uploadArea}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                        style={styles.fileInput}
                        id="thumbnail-upload"
                        disabled={uploadingThumbnail}
                    />
                    <label htmlFor="thumbnail-upload" style={styles.uploadLabel}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span style={styles.uploadText}>
                            {uploadingThumbnail
                                ? `Uploading Thumbnail... ${thumbnailProgress}%`
                                : thumbnail
                                    ? 'Click to change thumbnail'
                                    : 'Click to upload thumbnail'}
                        </span>
                        <span style={styles.uploadHint}>
                            PNG, JPG, GIF (recommended: 1280x720)
                        </span>
                    </label>
                </div>

                {thumbnail && (
                    <div style={styles.preview}>
                        <img
                            src={thumbnail.url}
                            alt="Video thumbnail"
                            style={styles.thumbnailPreview}
                        />
                        <button
                            type="button"
                            onClick={() => onThumbnailChange(null)}
                            className="btn btn-sm"
                            style={{ backgroundColor: 'var(--color-error)', color: 'white', marginTop: 'var(--spacing-sm)' }}
                        >
                            Remove Thumbnail
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-xl)',
    },
    uploadSection: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-md)',
        color: 'var(--text-primary)',
    },
    uploadArea: {
        marginBottom: 'var(--spacing-lg)',
    },
    fileInput: {
        display: 'none',
    },
    uploadLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl)',
        border: '2px dashed var(--color-gray-light)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        minHeight: '200px',
    },
    uploadText: {
        marginTop: 'var(--spacing-md)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        textAlign: 'center',
    },
    uploadHint: {
        marginTop: 'var(--spacing-xs)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
    },
    preview: {
        border: '1px solid var(--color-gray-lighter)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
    },
    videoPreview: {
        width: '100%',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-md)',
    },
    thumbnailPreview: {
        width: '100%',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-md)',
    },
    videoInfo: {
        fontSize: 'var(--font-size-sm)',
    },
    infoText: {
        margin: '0.25rem 0',
        color: 'var(--text-secondary)',
        wordBreak: 'break-all',
    },
};

export default VideoUploader;
