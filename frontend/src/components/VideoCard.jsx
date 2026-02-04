import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    const formatDuration = (duration) => {
        // Duration is already formatted as MM:SS or HH:MM:SS
        return duration || 'N/A';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Getting Started': 'var(--color-success)',
            'Sensors': 'var(--color-info)',
            'Motors & Actuators': 'var(--color-warning)',
            'Communication': 'var(--color-primary)',
            'Display': '#9333ea',
            'Projects': 'var(--color-accent)',
            'Advanced': 'var(--color-secondary)',
        };
        return colors[category] || 'var(--color-primary)';
    };

    return (
        <Link to={`/videos/${video._id}`} style={styles.card} className="card">
            {/* Thumbnail */}
            <div style={styles.thumbnailWrapper}>
                <img
                    src={video.thumbnail?.url || video.videoUrl.replace(/\.[^.]+$/, '.jpg')}
                    alt={video.thumbnail?.alt || video.title}
                    style={styles.thumbnail}
                    loading="lazy"
                />
                {video.duration && (
                    <span style={styles.duration}>{formatDuration(video.duration)}</span>
                )}
                <div style={styles.playButton}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div style={styles.content}>
                <div style={styles.header}>
                    <span
                        style={{
                            ...styles.categoryBadge,
                            backgroundColor: getCategoryColor(video.category),
                        }}
                    >
                        {video.category}
                    </span>
                </div>

                <h3 style={styles.title}>{video.title}</h3>

                <p style={styles.description}>
                    {video.description?.substring(0, 100)}
                    {video.description?.length > 100 ? '...' : ''}
                </p>

                {/* Stats */}
                <div style={styles.stats}>
                    <div style={styles.stat}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>{video.views || 0} views</span>
                    </div>
                    <div style={styles.stat}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        <span>{video.likes || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const styles = {
    card: {
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
    },
    thumbnailWrapper: {
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        backgroundColor: 'var(--color-dark)',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    },
    thumbnail: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.9,
        transition: 'opacity var(--transition-fast)',
    },
    duration: {
        position: 'absolute',
        bottom: 'var(--spacing-sm)',
        right: 'var(--spacing-sm)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
    },
    content: {
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    title: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        margin: 0,
        color: 'var(--text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    description: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        margin: 0,
    },
    stats: {
        display: 'flex',
        gap: 'var(--spacing-lg)',
        marginTop: 'var(--spacing-sm)',
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-muted)',
    },
};

export default VideoCard;
