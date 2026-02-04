import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService, categoryService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { trackPageView } from '../utils/facebookPixel';
import { trackTikTokPageView } from '../utils/tiktokPixel';

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Track page view
    React.useEffect(() => {
        trackPageView();
        trackTikTokPageView();
    }, []);

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    // Fetch products
    const { data: productsData, isLoading, error } = useQuery({
        queryKey: ['products', selectedCategory, searchQuery],
        queryFn: () =>
            productService.getProducts({
                category: selectedCategory,
                search: searchQuery,
                featured: !selectedCategory && !searchQuery ? 'true' : undefined,
            }),
    });

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div className="container">
                    <div style={styles.heroGrid}>
                        <div style={styles.heroContent}>
                            <h2 style={styles.heroTitle}>
                                Build Amazing Projects with Arduino
                            </h2>
                            <p style={styles.heroSubtitle}>
                                Everything you need to start your maker journey. Premium components, complete kits, and step-by-step tutorials for beginners and experts alike.
                            </p>
                            <div style={styles.heroActions}>
                                <a href="#products" className="btn btn-primary btn-lg">
                                    Shop Starter Kits
                                </a>
                                <a href="/videos" className="btn btn-outline btn-lg">
                                    Browse Projects
                                </a>
                            </div>
                        </div>
                        <div style={styles.heroVisual}>
                            <div style={styles.heroImagePlaceholder}>
                                🤖
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categoriesData?.data && (
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Shop by Category</h2>
                        <div style={styles.categories}>
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={!selectedCategory ? 'btn btn-primary' : 'btn btn-outline'}
                                style={styles.categoryBtn}
                            >
                                All Products
                            </button>
                            {categoriesData.data.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={
                                        selectedCategory === category._id ? 'btn btn-primary' : 'btn btn-outline'
                                    }
                                    style={styles.categoryBtn}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Search Bar */}
            <section id="products" style={styles.searchSection}>
                <div className="container">
                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Search for Arduino components, sensors, modules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchInput}
                        />
                        <button type="submit" className="btn btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">
                        {selectedCategory
                            ? categoriesData?.data?.find((c) => c._id === selectedCategory)?.name || 'Products'
                            : searchQuery
                                ? 'Search Results'
                                : 'Featured Starter Kits'}
                    </h2>
                    <p style={styles.sectionSubtitle}>
                        {!selectedCategory && !searchQuery && 'Curated collections to kickstart your electronics journey'}
                    </p>

                    {isLoading && (
                        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                            <div className="spinner"></div>
                        </div>
                    )}

                    {error && (
                        <div style={styles.error}>
                            <p>Error loading products. Please try again later.</p>
                        </div>
                    )}

                    {productsData?.data && productsData.data.length === 0 && (
                        <div style={styles.empty}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray)" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            <p>No products found</p>
                        </div>
                    )}

                    {productsData?.data && productsData.data.length > 0 && (
                        <div className="grid grid-4">
                            {productsData.data.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Value Proposition */}
            <section style={styles.valueProp}>
                <div className="container">
                    <div className="section-header" style={styles.sectionHeader}>
                        <h3 style={styles.valuePropTitle}>Why Choose Our Store?</h3>
                        <p style={styles.valuePropSubtitle}>Your trusted partner in electronics learning and making</p>
                    </div>
                    <div style={styles.featuresGrid}>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}>📦</div>
                            <h4 style={styles.featureTitle}>Quality Components</h4>
                            <p style={styles.featureText}>All authentic Arduino boards and premium electronic components. No knockoffs, guaranteed quality.</p>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}>🎓</div>
                            <h4 style={styles.featureTitle}>Learn As You Build</h4>
                            <p style={styles.featureText}>Step-by-step video tutorials and detailed guides for every project. Perfect for beginners.</p>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}>🚚</div>
                            <h4 style={styles.featureTitle}>Fast Shipping</h4>
                            <p style={styles.featureText}>Free shipping on orders over 5000 DA. Most orders ship within 24 hours.</p>
                        </div>
                        <div style={styles.featureItem}>
                            <div style={styles.featureIcon}>💬</div>
                            <h4 style={styles.featureTitle}>Expert Support</h4>
                            <p style={styles.featureText}>Get help from our community of makers and our technical support team whenever you need it.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section style={styles.promoBanner}>
                <div style={styles.promoContent}>
                    <h3 style={styles.promoTitle}>🎉 Special Launch Offer</h3>
                    <p style={styles.promoText}>Get 25% off your first starter kit purchase!</p>
                    <div style={styles.promoCode}>MAKER25</div>
                    <a href="#products" className="btn btn-primary" style={styles.promoBtn}>
                        Shop Now
                    </a>
                </div>
            </section>
        </div>
    );
};

const styles = {
    hero: {
        padding: '6rem 5% 4rem',
        animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
    },
    heroGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: '4rem',
        alignItems: 'center',
    },
    heroContent: {
        maxWidth: '100%',
    },
    heroTitle: {
        fontSize: 'clamp(2rem, 7vw, 3.5rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: 'var(--spacing-lg)',
        background: 'var(--gradient-glow)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-2xl)',
        lineHeight: 1.8,
    },
    heroActions: {
        display: 'flex',
        gap: 'var(--spacing-lg)',
        flexWrap: 'wrap',
    },
    heroVisual: {
        position: 'relative',
        height: 'clamp(300px, 50vw, 500px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImagePlaceholder: {
        width: '100%',
        height: '100%',
        background: 'var(--card-surface)',
        borderRadius: 'clamp(20px, 3vw, 30px)',
        border: '2px solid rgba(0, 217, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
    },
    categories: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    categoryBtn: {
        minWidth: '100px',
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    },
    searchSection: {
        padding: 'var(--spacing-2xl) 0',
    },
    searchForm: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        maxWidth: '600px',
        margin: '0 auto',
        flexWrap: 'wrap',
    },
    searchInput: {
        flex: 1,
        minWidth: '200px',
        padding: '0.75rem 1rem',
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        fontFamily: 'var(--font-primary)',
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '25px',
        background: 'var(--card-surface)',
        color: 'var(--text-primary)',
        transition: 'all 0.3s ease',
    },
    sectionSubtitle: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
        marginTop: '-var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
        padding: '0 1rem',
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
    valueProp: {
        background: 'var(--card-surface)',
        borderRadius: 'clamp(20px, 3vw, 30px)',
        padding: 'clamp(2rem, 5vw, 4rem) 5%',
        margin: 'clamp(2rem, 5vw, 4rem) 5%',
        maxWidth: '1300px',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '1px solid rgba(0, 217, 255, 0.2)',
    },
    sectionHeader: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    valuePropTitle: {
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: 700,
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    valuePropSubtitle: {
        color: 'var(--text-secondary)',
        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
        padding: '0 1rem',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 'clamp(2rem, 4vw, 3rem)',
        marginTop: '3rem',
    },
    featureItem: {
        textAlign: 'center',
        padding: '0 1rem',
    },
    featureIcon: {
        fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
        marginBottom: '1rem',
        display: 'inline-block',
    },
    featureTitle: {
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        marginBottom: '0.8rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
    },
    featureText: {
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    },
    promoBanner: {
        background: 'linear-gradient(135deg, var(--warm-orange) 0%, #ff8f5e 100%)',
        padding: 'clamp(2rem, 5vw, 3rem) 5%',
        textAlign: 'center',
        margin: 'clamp(2rem, 5vw, 4rem) 0',
    },
    promoContent: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    promoTitle: {
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: 800,
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    promoText: {
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
        marginBottom: '2rem',
        opacity: 0.9,
        color: 'var(--text-primary)',
    },
    promoCode: {
        display: 'inline-block',
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
        background: 'rgba(255, 255, 255, 0.2)',
        border: '2px dashed white',
        borderRadius: '15px',
        fontFamily: "'Space Mono', monospace",
        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
        fontWeight: 700,
        letterSpacing: '2px',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
    },
    promoBtn: {
        background: 'white',
        color: 'var(--warm-orange)',
    },
};

export default HomePage;

