import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import VideoUploader from '../components/VideoUploader';

const VideoForm = ({ videoData, isEdit = false }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: videoData?.title || '',
        description: videoData?.description || '',
        category: videoData?.category || '',
        difficulty: videoData?.difficulty || 'beginner',
        duration: videoData?.duration || '',
        video: videoData?.video || null,
        thumbnail: videoData?.thumbnail || null,
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.post('/videos', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['videos']);
            alert('Video created successfully!');
            navigate('/admin/videos');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to create video');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put(`/videos/${videoData._id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['videos']);
            alert('Video updated successfully!');
            navigate('/admin/videos');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to update video');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.video || !formData.thumbnail) {
            alert('Please upload both video and thumbnail');
            return;
        }

        if (isEdit) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <button
                        onClick={() => navigate('/admin/videos')}
                        className="btn btn-outline btn-sm"
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    >
                        ← Back to Videos
                    </button>
                    <h1 style={styles.title}>{isEdit ? 'Edit Video' : 'Upload Video'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Video & Thumbnail Upload */}
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>Media Files</h2>
                    <VideoUploader
                        video={formData.video}
                        thumbnail={formData.thumbnail}
                        onVideoChange={(video) => setFormData({ ...formData, video })}
                        onThumbnailChange={(thumbnail) => setFormData({ ...formData, thumbnail })}
                    />
                </div>

                {/* Video Information */}
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={styles.sectionTitle}>Video Information</h2>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                            required
                            placeholder="e.g., Getting Started with Arduino Uno"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input"
                            rows="4"
                            placeholder="Describe what viewers will learn in this video..."
                        />
                    </div>

                    <div style={styles.formRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Getting Started">Getting Started</option>
                                <option value="Sensors">Sensors</option>
                                <option value="Motors & Actuators">Motors & Actuators</option>
                                <option value="Communication">Communication</option>
                                <option value="Display">Display</option>
                                <option value="Projects">Projects</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Difficulty Level *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="input"
                                required
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Duration (optional)</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., 10:25"
                        />
                        <span style={styles.hint}>Format: MM:SS or HH:MM:SS</span>
                    </div>
                </div>

                {/* Submit */}
                <div style={styles.submitSection}>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/videos')}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={createMutation.isLoading || updateMutation.isLoading}
                    >
                        {createMutation.isLoading || updateMutation.isLoading
                            ? 'Saving...'
                            : isEdit
                                ? 'Update Video'
                                : 'Upload Video'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    header: {
        marginBottom: 'var(--spacing-2xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        margin: 0,
    },
    sectionTitle: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-lg)',
    },
    formGroup: {
        marginBottom: 'var(--spacing-lg)',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
    },
    label: {
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-xs)',
        color: 'var(--text-primary)',
    },
    hint: {
        display: 'block',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        marginTop: 'var(--spacing-xs)',
    },
    submitSection: {
        marginTop: 'var(--spacing-2xl)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--spacing-md)',
    },
};

export default VideoForm;
