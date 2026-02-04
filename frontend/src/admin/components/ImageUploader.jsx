import React, { useState } from 'react';
import api from '../../services/api';

const ImageUploader = ({ images = [], onImagesChange }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hoveredImage, setHoveredImage] = useState(null);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadedImages = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('image', file);

                const response = await api.post('/products/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            ((i + progressEvent.loaded / progressEvent.total) / files.length) * 100
                        );
                        setUploadProgress(percentCompleted);
                    },
                });

                uploadedImages.push(response.data.data);
            }

            onImagesChange([...images, ...uploadedImages]);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            e.target.value = ''; // Reset input
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleSetPrimary = (index) => {
        const newImages = [...images];
        const [primaryImage] = newImages.splice(index, 1);
        newImages.unshift(primaryImage);
        onImagesChange(newImages);
    };

    return (
        <div style={styles.container}>
            <div style={styles.uploadArea}>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={styles.fileInput}
                    id="image-upload"
                    disabled={uploading}
                />
                <label htmlFor="image-upload" style={styles.uploadLabel}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={styles.uploadText}>
                        {uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload images'}
                    </span>
                    <span style={styles.uploadHint}>
                        PNG, JPG, GIF up to 10MB
                    </span>
                </label>
            </div>

            {images.length > 0 && (
                <div style={styles.imageGrid}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            style={styles.imageCard}
                            onMouseEnter={() => setHoveredImage(index)}
                            onMouseLeave={() => setHoveredImage(null)}
                        >
                            {index === 0 && (
                                <span style={styles.primaryBadge}>Primary</span>
                            )}
                            <img
                                src={image.url}
                                alt={image.alt || `Product image ${index + 1}`}
                                style={styles.image}
                            />
                            <div style={{
                                ...styles.imageActions,
                                opacity: hoveredImage === index ? 1 : 0,
                            }}>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetPrimary(index)}
                                        style={styles.actionBtn}
                                        title="Set as primary"
                                    >
                                        ⭐
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                                    title="Remove"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        marginBottom: 'var(--spacing-xl)',
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
        padding: 'var(--spacing-3xl)',
        border: '2px dashed var(--color-gray-light)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
    },
    uploadText: {
        marginTop: 'var(--spacing-md)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    uploadHint: {
        marginTop: 'var(--spacing-xs)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    imageGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--spacing-md)',
    },
    imageCard: {
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-gray-lighter)',
        aspectRatio: '1',
    },
    primaryBadge: {
        position: 'absolute',
        top: 'var(--spacing-xs)',
        left: 'var(--spacing-xs)',
        padding: '0.25rem 0.5rem',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        zIndex: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    imageActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '0.25rem',
        padding: 'var(--spacing-xs)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transition: 'opacity var(--transition-base)',
    },
    actionBtn: {
        flex: 1,
        padding: 'var(--spacing-xs)',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background var(--transition-fast)',
    },
    deleteBtn: {
        background: 'rgba(244, 67, 54, 0.8)',
    },
};

export default ImageUploader;
