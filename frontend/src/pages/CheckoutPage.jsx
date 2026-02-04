import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { orderService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { trackInitiateCheckout, trackPurchase } from '../utils/facebookPixel';
import { trackTikTokInitiateCheckout, trackTikTokPurchase } from '../utils/tiktokPixel';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart, getCartItemsCount } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        notes: '',
    });

    React.useEffect(() => {
        trackInitiateCheckout(getCartTotal(), 'DZD', getCartItemsCount());
        trackTikTokInitiateCheckout(getCartTotal());
    }, []);

    const createOrderMutation = useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (data) => {
            trackPurchase(getCartTotal(), 'DZD', data.data.orderNumber);
            trackTikTokPurchase(getCartTotal());
            clearCart();
            alert(`Order placed successfully! Order number: ${data.data.orderNumber}`);
            navigate('/');
        },
        onError: (error) => {
            alert('Error placing order. Please try again.');
            console.error(error);
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const orderData = {
            customer: {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
            },
            items: cartItems.map((item) => ({
                product: item._id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                fullName: formData.fullName,
                phone: formData.phone,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
            },
            notes: formData.notes,
            shippingPrice: 400, // Fixed shipping for now
        };

        createOrderMutation.mutate(orderData);
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container section">
            <h1 style={styles.title}>Checkout</h1>

            <div style={styles.layout}>
                {/* Checkout Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={styles.sectionTitle}>Contact Information</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
                        <h2 style={styles.sectionTitle}>Shipping Address</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Address Line 1 *</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Address Line 2</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>State/Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Order Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input"
                                rows="4"
                                placeholder="Special instructions for delivery..."
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-lg)' }}>
                        <h2 style={styles.sectionTitle}>Payment Method</h2>
                        <div style={styles.paymentMethod}>
                            <div style={styles.codBadge}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                                <div>
                                    <strong>Cash on Delivery (COD)</strong>
                                    <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>
                                        Pay when you receive your order
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                        disabled={createOrderMutation.isPending}
                    >
                        {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>

                {/* Order Summary */}
                <div style={styles.summarySection}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={styles.sectionTitle}>Order Summary</h2>

                        <div style={styles.orderItems}>
                            {cartItems.map((item) => (
                                <div key={item._id} style={styles.orderItem}>
                                    <div style={styles.orderItemImage}>
                                        {item.images && item.images[0] && (
                                            <img src={item.images[0].url} alt={item.name} style={styles.itemImage} />
                                        )}
                                    </div>
                                    <div style={styles.orderItemInfo}>
                                        <p style={styles.orderItemName}>{item.name}</p>
                                        <p style={styles.orderItemQty}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={styles.orderItemPrice}>{item.price * item.quantity} DA</p>
                                </div>
                            ))}
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>{getCartTotal()} DA</span>
                        </div>

                        <div style={styles.summaryRow}>
                            <span>Shipping:</span>
                            <span>400 DA</span>
                        </div>

                        <div style={styles.divider}></div>

                        <div style={styles.summaryRow}>
                            <strong style={{ fontSize: 'var(--font-size-lg)' }}>Total:</strong>
                            <strong style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>
                                {getCartTotal() + 400} DA
                            </strong>
                        </div>
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
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    sectionTitle: {
        fontSize: 'var(--font-size-xl)',
        marginBottom: 'var(--spacing-lg)',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-md)',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-md)',
    },
    label: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--text-primary)',
    },
    paymentMethod: {
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    codBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
    },
    summarySection: {
        position: 'sticky',
        top: '100px',
        alignSelf: 'start',
    },
    orderItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
    },
    orderItem: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        alignItems: 'center',
    },
    orderItemImage: {
        width: '60px',
        height: '60px',
        backgroundColor: 'var(--color-gray-lightest)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        flexShrink: 0,
    },
    itemImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    orderItemInfo: {
        flex: 1,
    },
    orderItemName: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        margin: 0,
    },
    orderItemQty: {
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        margin: '0.25rem 0 0',
    },
    orderItemPrice: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-sm)',
    },
    divider: {
        height: '1px',
        backgroundColor: 'var(--color-gray-lighter)',
        margin: 'var(--spacing-md) 0',
    },
};

export default CheckoutPage;
