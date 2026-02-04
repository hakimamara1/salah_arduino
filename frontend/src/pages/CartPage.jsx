import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="container section" style={styles.empty}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray)" strokeWidth="1.5">
                    <path d="M9 2L7.17 4H3.5C2.67 4 2 4.67 2 5.5V6.5C2.67 8 3.5 8H20.5C21.33 8 22 7.33 22 6.5V5.5C22 4.67 21.33 4 20.5 4H16.83L15 2H9Z" />
                    <path d="M3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8" />
                </svg>
                <h2>Your cart is empty</h2>
                <p>Start adding some amazing Arduino components to your cart!</p>
                <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--spacing-xl)' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container section">
            <h1 style={styles.title}>Shopping Cart</h1>

            <div style={styles.layout}>
                {/* Cart Items */}
                <div style={styles.itemsSection}>
                    {cartItems.map((item) => (
                        <div key={item._id} style={styles.cartItem} className="card">
                            <div style={styles.itemImage}>
                                {item.images && item.images[0] && (
                                    <img src={item.images[0].url} alt={item.name} style={styles.image} />
                                )}
                            </div>

                            <div style={styles.itemInfo}>
                                <Link to={`/products/${item.slug}`} style={styles.itemName}>
                                    {item.name}
                                </Link>
                                <p style={styles.itemPrice}>{item.price} DA</p>
                            </div>

                            <div style={styles.quantityControl}>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="btn btn-outline btn-sm"
                                    style={styles.quantityBtn}
                                >
                                    −
                                </button>
                                <span style={styles.quantity}>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="btn btn-outline btn-sm"
                                    style={styles.quantityBtn}
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>

                            <div style={styles.itemTotal}>
                                <p style={styles.totalPrice}>{item.price * item.quantity} DA</p>
                            </div>

                            <button
                                onClick={() => removeFromCart(item._id)}
                                style={styles.removeBtn}
                                aria-label="Remove item"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={styles.summarySection}>
                    <div style={styles.summary} className="card">
                        <h2 style={styles.summaryTitle}>Order Summary</h2>

                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>{getCartTotal()} DA</span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Shipping:</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.summaryRow}>
                            <strong style={{ fontSize: 'var(--font-size-lg)' }}>Total:</strong>
                            <strong style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>
                                {getCartTotal()} DA
                            </strong>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}>
                            Proceed to Checkout
                        </Link>

                        <Link to="/" className="btn btn-outline" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    title: {
        fontSize: 'var(--font-size-3xl)',
        marginBottom: 'var(--spacing-2xl)',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 'var(--spacing-2xl)',
    },
    itemsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto auto auto',
        gap: 'var(--spacing-lg)',
        alignItems: 'center',
        padding: 'var(--spacing-lg)',
    },
    itemImage: {
        width: '100px',
        height: '100px',
        backgroundColor: 'var(--color-gray-lightest)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
    },
    itemName: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        textDecoration: 'none',
    },
    itemPrice: {
        fontSize: 'var(--font-size-base)',
        color: 'var(--text-secondary)',
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
    },
    quantityBtn: {
        width: '32px',
        height: '32px',
        padding: 0,
    },
    quantity: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 600,
        minWidth: '30px',
        textAlign: 'center',
    },
    itemTotal: {
        minWidth: '100px',
        textAlign: 'right',
    },
    totalPrice: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 700,
        color: 'var(--color-primary)',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-error)',
        cursor: 'pointer',
        padding: 'var(--spacing-sm)',
        borderRadius: 'var(--radius-sm)',
        transition: 'background var(--transition-fast)',
    },
    summarySection: {
        position: 'sticky',
        top: '100px',
        alignSelf: 'start',
    },
    summary: {
        padding: 'var(--spacing-xl)',
    },
    summaryTitle: {
        fontSize: 'var(--font-size-xl)',
        marginBottom: 'var(--spacing-lg)',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-md)',
        fontSize: 'var(--font-size-base)',
    },
    divider: {
        height: '1px',
        backgroundColor: 'var(--color-gray-lighter)',
        margin: 'var(--spacing-lg) 0',
    },
    empty: {
        textAlign: 'center',
        padding: 'var(--spacing-3xl) 0',
    },
};

export default CartPage;
