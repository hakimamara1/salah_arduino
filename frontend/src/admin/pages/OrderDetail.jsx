import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import adminService from '../../services/adminService';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [newStatus, setNewStatus] = useState('');

    const { data: order, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const res = await api.get(`/orders/${id}`);
            return res.data.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['order', id]);
            alert('Order status updated successfully!');
            setNewStatus('');
        },
    });

    const handleStatusUpdate = () => {
        if (newStatus && newStatus !== order.status) {
            updateStatusMutation.mutate({ id, status: newStatus });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            confirmed: 'primary',
            processing: 'primary',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'error',
        };
        return colors[status] || 'primary';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div>
            <div style={styles.header}>
                <div>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="btn btn-outline btn-sm"
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    >
                        ← Back to Orders
                    </button>
                    <h1 style={styles.title}>Order #{order.orderNumber}</h1>
                </div>
                <span className={`badge badge-${getStatusColor(order.status)}`} style={{ fontSize: 'var(--font-size-base)' }}>
                    {order.status}
                </span>
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Order Items */}
                <div className="card">
                    <h2 style={styles.sectionTitle}>Order Items</h2>
                    <div style={styles.items}>
                        {order.items?.map((item) => (
                            <div key={item._id} style={styles.item}>
                                <div style={styles.itemInfo}>
                                    <div style={styles.itemName}>{item.product?.name || 'Product'}</div>
                                    <div style={styles.itemDetails}>
                                        Quantity: {item.quantity} × {item.price} DA
                                    </div>
                                </div>
                                <div style={styles.itemTotal}>{item.quantity * item.price} DA</div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.orderTotal}>
                        <span>Total:</span>
                        <span style={styles.totalAmount}>{order.totalPrice} DA</span>
                    </div>
                </div>

                {/* Customer & Shipping Info */}
                <div>
                    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h2 style={styles.sectionTitle}>Customer Information</h2>
                        <div style={styles.infoGrid}>
                            <div>
                                <div style={styles.label}>Name</div>
                                <div style={styles.value}>{order.customer?.name}</div>
                            </div>
                            <div>
                                <div style={styles.label}>Email</div>
                                <div style={styles.value}>{order.customer?.email}</div>
                            </div>
                            <div>
                                <div style={styles.label}>Phone</div>
                                <div style={styles.value}>{order.customer?.phone}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h2 style={styles.sectionTitle}>Shipping Address</h2>
                        <div style={styles.address}>
                            <div>{order.shippingAddress?.address}</div>
                            <div>{order.shippingAddress?.city}, {order.shippingAddress?.wilaya}</div>
                            <div>{order.shippingAddress?.postalCode}</div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 style={styles.sectionTitle}>Update Status</h2>
                        <div style={styles.statusUpdate}>
                            <select
                                className="input"
                                value={newStatus || order.status}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={handleStatusUpdate}
                                disabled={!newStatus || newStatus === order.status}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
    items: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontWeight: 500,
        color: 'var(--text-primary)',
        marginBottom: '0.25rem',
    },
    itemDetails: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    itemTotal: {
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    orderTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--spacing-lg)',
        paddingTop: 'var(--spacing-lg)',
        borderTop: '2px solid var(--color-gray-lighter)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
    },
    totalAmount: {
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-2xl)',
    },
    infoGrid: {
        display: 'grid',
        gap: 'var(--spacing-md)',
    },
    label: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        marginBottom: '0.25rem',
    },
    value: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    address: {
        lineHeight: 1.6,
        color: 'var(--text-primary)',
    },
    statusUpdate: {
        display: 'flex',
        gap: 'var(--spacing-md)',
    },
};

export default OrderDetail;
