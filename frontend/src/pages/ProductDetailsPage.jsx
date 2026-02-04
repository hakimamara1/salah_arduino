import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { trackViewContent } from '../utils/facebookPixel';
import { trackTikTokViewContent } from '../utils/tiktokPixel';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug),
    });

    const product = data?.data;

    // Track view content
    useEffect(() => {
        if (product) {
            trackViewContent(product.name, product._id, product.price);
            trackTikTokViewContent(product.name, product._id, product.price);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            alert('Added to cart!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                    Back to Home
                </a>
            </div>
        );
    }

    return (
        <div className="container section">
            <div style={styles.layout}>
                {/* Images */}
                <div style={styles.imageSection}>
                    <div style={styles.mainImage}>
                        {product.images && product.images.length > 0 && (
                            <img
                                src={product.images[selectedImage]?.url}
                                alt={product.images[selectedImage]?.alt || product.name}
                                style={styles.image}
                            />
                        )}
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div style={styles.thumbnails}>
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    style={{
                                        ...styles.thumbnail,
                                        border:
                                            selectedImage === index
                                                ? '2px solid var(--color-primary)'
                                                : '2px solid transparent',
                                    }}
                                >
                                    <img src={img.url} alt={img.alt || product.name} style={styles.thumbnailImage} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={styles.infoSection}>
                    {product.category && (
                        <span className="badge badge-primary">{product.category.name}</span>
                    )}

                    <h1 style={styles.title}>{product.name}</h1>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div style={styles.rating}>
                            <div style={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={i < Math.round(product.rating) ? 'var(--color-secondary)' : 'var(--color-gray-light)'}
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <span style={styles.ratingText}>
                                {product.rating} ({product.numReviews} reviews)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div style={styles.priceWrapper}>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span style={styles.comparePrice}>{product.compareAtPrice} DA</span>
                        )}
                        <span style={styles.price}>{product.price} DA</span>
                    </div>

                    {/* Stock Status */}
                    <div style={styles.stock}>
                        {product.stock > 0 ? (
                            <span style={styles.inStock}> In Stock ({product.stock} available)</span>
                        ) : (
                            <span style={styles.outOfStock}>✕ Out of Stock</span>
                        )}
                    </div>

                    {/* Description */}
                    <div style={styles.description}>
                        <p>{product.description}</p>
                    </div>

                    {/* Specifications */}
                    {product.specifications && (
                        <div style={styles.specs}>
                            <h3>Specifications</h3>
                            <div style={styles.specsGrid}>
                                {product.specifications.voltage && (
                                    <div style={styles.specItem}>
                                        <strong>Voltage:</strong> {product.specifications.voltage}
                                    </div>
                                )}
                                {product.specifications.current && (
                                    <div style={styles.specItem}>
                                        <strong>Current:</strong> {product.specifications.current}
                                    </div>
                                )}
                                {product.specifications.interface && (
                                    <div style={styles.specItem}>
                                        <strong>Interface:</strong> {product.specifications.interface}
                                    </div>
                                )}
                                {product.specifications.chipset && (
                                    <div style={styles.specItem}>
                                        <strong>Chipset:</strong> {product.specifications.chipset}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart */}
                    <div style={styles.actions}>
                        <div style={styles.quantityWrapper}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={styles.quantityBtn}
                                className="btn btn-outline"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max={product.stock}
                                style={styles.quantityInput}
                                className="input"
                            />
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                style={styles.quantityBtn}
                                className="btn btn-outline"
                                disabled={quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1 }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    layout: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--spacing-3xl)',
    },
    imageSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    mainImage: {
        width: '100%',
        aspectRatio: '1',
        backgroundColor: 'var(--color-gray-lightest)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    thumbnails: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        overflow: 'auto',
    },
    thumbnail: {
        width: '80px',
        height: '80px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'border var(--transition-fast)',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    infoSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        marginTop: 'var(--spacing-sm)',
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
    },
    stars: {
        display: 'flex',
        gap: '4px',
    },
    ratingText: {
        fontSize: 'var(--font-size-base)',
        color: 'var(--text-secondary)',
    },
    priceWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-sm)',
    },
    comparePrice: {
        fontSize: 'var(--font-size-xl)',
        color: 'var(--text-muted)',
        textDecoration: 'line-through',
    },
    price: {
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
    },
    stock: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 600,
    },
    inStock: {
        color: 'var(--color-success)',
    },
    outOfStock: {
        color: 'var(--color-error)',
    },
    description: {
        fontSize: 'var(--font-size-base)',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
        marginTop: 'var(--spacing-md)',
    },
    specs: {
        marginTop: 'var(--spacing-lg)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    specsGrid: {
        display: 'grid',
        gap: 'var(--spacing-sm)',
        marginTop: 'var(--spacing-md)',
    },
    specItem: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    actions: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-xl)',
    },
    quantityWrapper: {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        alignItems: 'center',
    },
    quantityBtn: {
        width: '40px',
        padding: '0.5rem',
    },
    quantityInput: {
        width: '80px',
        textAlign: 'center',
    },
};

export default ProductDetailsPage;
