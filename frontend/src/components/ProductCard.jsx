import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <Link to={`/products/${product.slug}`} style={styles.card} className="card">
            {/* Image */}
            <div style={styles.imageWrapper}>
                {primaryImage && (
                    <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.name}
                        style={styles.image}
                        loading="lazy"
                    />
                )}
                {product.featured && (
                    <span style={styles.featuredBadge} className="badge badge-secondary">
                        Featured
                    </span>
                )}
                {product.stock === 0 && (
                    <div style={styles.overlay}>
                        <span style={styles.outOfStock}>Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={styles.content}>
                {/* Category */}
                {product.category && (
                    <span style={styles.category} className="badge badge-primary">
                        {product.category.name || product.category}
                    </span>
                )}

                {/* Title */}
                <h3 style={styles.title}>{product.name}</h3>

                {/* Description */}
                <p style={styles.description}>
                    {product.description?.substring(0, 80)}
                    {product.description?.length > 80 ? '...' : ''}
                </p>

                {/* Rating */}
                {product.rating > 0 && (
                    <div style={styles.rating}>
                        <div style={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={i < Math.round(product.rating) ? 'var(--color-secondary)' : 'var(--color-gray-light)'}
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ))}
                        </div>
                        <span style={styles.reviewCount}>({product.numReviews})</span>
                    </div>
                )}

                {/* Price and Action */}
                <div style={styles.footer}>
                    <div style={styles.priceWrapper}>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span style={styles.comparePrice}>{product.compareAtPrice} DA</span>
                        )}
                        <span style={styles.price}>{product.price} DA</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="btn btn-primary btn-sm"
                        style={styles.addButton}
                    >
                        Add to Cart
                    </button>
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
        cursor: 'pointer',
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        paddingTop: '75%',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a88 100%)',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform var(--transition-slow)',
    },
    featuredBadge: {
        position: 'absolute',
        top: 'var(--spacing-md)',
        right: 'var(--spacing-md)',
        padding: '0.5rem 1rem',
        background: 'var(--warm-orange)',
        borderRadius: '20px',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outOfStock: {
        color: 'white',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
    },
    content: {
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
    },
    category: {
        alignSelf: 'flex-start',
        color: 'var(--electric-blue)',
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem',
    },
    title: {
        fontSize: '1.3rem',
        fontWeight: 700,
        margin: 0,
        color: 'var(--text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        fontFamily: "'Space Mono', monospace",
    },
    description: {
        fontSize: '0.95rem',
        color: 'var(--text-secondary)',
        margin: 0,
        marginBottom: '1.2rem',
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
    },
    stars: {
        display: 'flex',
        gap: '2px',
    },
    reviewCount: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-muted)',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'var(--spacing-lg)',
    },
    priceWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    comparePrice: {
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        textDecoration: 'line-through',
        marginLeft: '0.5rem',
    },
    price: {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--soft-mint)',
    },
    addButton: {
        whiteSpace: 'nowrap',
        padding: '0.7rem 1.5rem',
        borderRadius: '25px',
    },
};

export default ProductCard;

