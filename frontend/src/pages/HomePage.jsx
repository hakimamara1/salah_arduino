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
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>
                            Build Amazing Projects with
                            <span style={styles.gradient}> Arduino Components</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Premium quality sensors, modules, and development boards for makers and
                            engineers. Learn with our video tutorials.
                        </p>
                        <div style={styles.heroActions}>
                            <a href="#products" className="btn btn-primary btn-lg">
                                Shop Now
                            </a>
                            <a href="/videos" className="btn btn-outline btn-lg">
                                Watch Tutorials
                            </a>
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
                            className="input"
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
                                : 'Featured Products'}
                    </h2>

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

            {/* Features */}
            <section className="section" style={styles.features}>
                <div className="container">
                    <div className="grid grid-3">
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3>Premium Quality</h3>
                            <p>All products are tested and verified for quality and performance</p>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable delivery across Algeria</p>
                        </div>
                        <div style={styles.feature}>
                            <div style={styles.featureIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h3>Learning Resources</h3>
                            <p>Free video tutorials to help you build amazing projects</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    hero: {
        background: 'linear-gradient(135deg, rgba(0, 151, 157, 0.1), rgba(228, 113, 40, 0.1))',
        padding: '5rem 0',
    },
    heroContent: {
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    heroTitle: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: 'var(--spacing-lg)',
    },
    gradient: {
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        fontSize: 'var(--font-size-lg)',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-2xl)',
        lineHeight: 1.6,
    },
    heroActions: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    categories: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    categoryBtn: {
        minWidth: '120px',
    },
    searchSection: {
        padding: 'var(--spacing-2xl) 0',
    },
    searchForm: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        maxWidth: '600px',
        margin: '0 auto',
    },
    searchInput: {
        flex: 1,
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
    features: {
        backgroundColor: 'var(--bg-primary)',
    },
    feature: {
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
    },
    featureIcon: {
        width: '80px',
        height: '80px',
        margin: '0 auto var(--spacing-lg)',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
};

export default HomePage;
