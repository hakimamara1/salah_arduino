import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { trackPageView } from '../utils/facebookPixel';
import { trackTikTokPageView } from '../utils/tiktokPixel';

const VideoPlayerPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        trackPageView();
        trackTikTokPageView();
    }, []);

    const { data: video, isLoading } = useQuery({
        queryKey: ['video', id],
        queryFn: async () => {
            const res = await api.get(`/videos/${id}`);
            return res.data.data;
        },
    });

    const likeMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/videos/${id}/like`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['video', id]);
            setHasLiked(true);
        },
    });

    const handleLike = () => {
        if (!hasLiked) {
            likeMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ minHeight: '400px', paddingTop: 'var(--spacing-3xl)' }}>
                <div className="flex items-center justify-center">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="container" style={{ minHeight: '400px', paddingTop: 'var(--spacing-3xl)' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                    <h2>Video not found</h2>
                    <Link to="/videos" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                        Back to Videos
                    </Link>
                </div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'var(--color-success)',
            intermediate: 'var(--color-warning)',
            advanced: 'var(--color-error)',
        };
        return colors[difficulty] || 'var(--color-primary)';
    };

    return (
        <div>
            {/* Back Button */}
            <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-lg)' }}>
                <Link to="/videos" className="btn btn-outline btn-sm">
                    ← Back to Videos
                </Link>
            </div>

            {/* Video Player */}
            <div className="container">
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={styles.videoWrapper}>
                        <video
                            src={video.videoUrl}
                            controls
                            autoPlay
                            style={styles.video}
                            poster={video.thumbnail?.url}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video Info */}
                    <div style={styles.videoInfo}>
                        <div style={styles.header}>
                            <div>
                                <h1 style={styles.title}>{video.title}</h1>
                                <div style={styles.badges}>
                                    <span className="badge badge-primary">{video.category}</span>
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: getDifficultyColor(video.difficulty) }}
                                    >
                                        {video.difficulty}
                                    </span>
                                    {video.duration && (
                                        <span className="badge" style={{ backgroundColor: 'var(--color-gray)' }}>
                                            {video.duration}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={styles.stats}>
                                <div style={styles.stat}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>{video.views} views</span>
                                </div>
                                <button
                                    onClick={handleLike}
                                    className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline'}`}
                                    style={styles.likeBtn}
                                    disabled={hasLiked}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                    </svg>
                                    <span>{video.likes}</span>
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        {video.description && (
                            <div style={styles.description}>
                                <h3 style={styles.sectionTitle}>About this video</h3>
                                <p>{video.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {video.relatedProducts && video.relatedProducts.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2 style={styles.sectionTitle}>Components Used in This Tutorial</h2>
                        <div className="grid grid-3">
                            {video.relatedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

const styles = {
    videoWrapper: {
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 aspect ratio
        backgroundColor: 'var(--color-dark)',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    videoInfo: {
        padding: 'var(--spacing-2xl)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'var(--spacing-xl)',
        flexWrap: 'wrap',
        marginBottom: 'var(--spacing-xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        margin: '0 0 var(--spacing-md) 0',
    },
    badges: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        flexWrap: 'wrap',
    },
    stats: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        fontSize: 'var(--font-size-base)',
        color: 'var(--text-secondary)',
    },
    likeBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
    },
    description: {
        borderTop: '1px solid var(--color-gray-lighter)',
        paddingTop: 'var(--spacing-xl)',
    },
    sectionTitle: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-lg)',
    },
};

export default VideoPlayerPage;
