import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '../services/productService';
import VideoCard from '../components/VideoCard';
import { trackPageView } from '../utils/facebookPixel';
import { trackTikTokPageView } from '../utils/tiktokPixel';

const VideoLearnerPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        trackPageView();
        trackTikTokPageView();
    }, []);

    const { data, isLoading, error } = useQuery({
        queryKey: ['videos', selectedCategory, searchQuery],
        queryFn: () =>
            videoService.getVideos({
                category: selectedCategory,
                search: searchQuery,
                featured: !selectedCategory && !searchQuery ? 'true' : undefined,
            }),
    });

    const categories = [
        'Getting Started',
        'Sensors',
        'Motors & Actuators',
        'Communication',
        'Display',
        'Projects',
        'Advanced'
    ];

    return (
        <div>
            {/* Header */}
            <section style={styles.header}>
                <div className="container">
                    <h1 style={styles.title}>
                        <span style={styles.gradient}>Video</span> Learning Center
                    </h1>
                    <p style={styles.subtitle}>
                        Learn how to build amazing Arduino projects with step-by-step video tutorials
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div style={styles.categories}>
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={!selectedCategory ? 'btn btn-primary' : 'btn btn-outline'}
                        >
                            All Videos
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={
                                    selectedCategory === category ? 'btn btn-primary' : 'btn btn-outline'
                                }
                                style={styles.categoryBtn}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input"
                            style={styles.searchInput}
                        />
                    </div>
                </div>
            </section>

            {/* Videos Grid */}
            <section className="section">
                <div className="container">
                    {isLoading && (
                        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {error && (
                        <div style={styles.error}>
                            <p>Error loading videos. Please try again later.</p>
                        </div>
                    )}

                    {data?.data && data.data.length === 0 && (
                        <div style={styles.empty}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray)" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                            <p>No videos found</p>
                        </div>
                    )}

                    {data?.data && data.data.length > 0 && (
                        <div className="grid grid-3">
                            {data.data.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section" style={styles.cta}>
                <div className="container">
                    <div style={styles.ctaContent}>
                        <h2>Ready to Start Building?</h2>
                        <p>Get the components you need for your next Arduino project</p>
                        <a href="/" className="btn btn-primary btn-lg">
                            Shop Components
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    header: {
        background: 'linear-gradient(135deg, rgba(0, 151, 157, 0.1), rgba(228, 113, 40, 0.1))',
        padding: '4rem 0',
        textAlign: 'center',
    },
    title: {
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 800,
        marginBottom: 'var(--spacing-md)',
    },
    gradient: {
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    subtitle: {
        fontSize: 'var(--font-size-lg)',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto',
    },
    categories: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 'var(--spacing-xl)',
    },
    categoryBtn: {
        textTransform: 'capitalize',
    },
    searchWrapper: {
        maxWidth: '500px',
        margin: '0 auto',
    },
    searchInput: {
        width: '100%',
    },
    error: {
        textAlign: 'center',
        padding: 'var(--spacing-3xl)',
        color: 'var(--color-error)',
    },
    empty: {
        textAlign: 'center',
        padding: 'var(--spacing-3xl)',
        color: 'var(--text-muted)',
    },
    cta: {
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        color: 'white',
    },
    ctaContent: {
        textAlign: 'center',
        padding: 'var(--spacing-2xl)',
    },
};

export default VideoLearnerPage;
