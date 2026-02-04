import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const OrderList = () => {
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', { status, page }],
        queryFn: async () => {
            const res = await api.get('/orders', {
                params: { status, page, limit: 20 },
            });
            return res.data;
        },
    });

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

    return (
        <div>
            <div style={styles.header}>
                <h1 style={styles.title}>Orders</h1>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={styles.filters}>
                    <select
                        className="input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ minWidth: '200px' }}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Order #</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Items</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.data?.map((order) => (
                                <tr key={order._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <span style={styles.orderNumber}>#{order.orderNumber}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div>
                                            <div style={styles.customerName}>{order.customer?.name}</div>
                                            <div style={styles.customerEmail}>{order.customer?.email}</div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.phone}>{order.customer?.phone}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.itemCount}>{order.items?.length} items</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.total}>{order.totalPrice} DA</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span className={`badge badge-${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.date}>
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders?.pagination && (
                    <div style={styles.pagination}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {orders.pagination.page} of {orders.pagination.pages}
                        </span>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page === orders.pagination.pages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-2xl)',
    },
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        margin: 0,
    },
    filters: {
        display: 'flex',
        gap: 'var(--spacing-md)',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: 'var(--spacing-md)',
        borderBottom: '2px solid var(--color-gray-lighter)',
        fontWeight: 600,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    tr: {
        borderBottom: '1px solid var(--color-gray-lighter)',
    },
    td: {
        padding: 'var(--spacing-md)',
    },
    orderNumber: {
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    customerName: {
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    customerEmail: {
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        marginTop: '0.125rem',
    },
    phone: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    itemCount: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    total: {
        fontWeight: 600,
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)',
    },
    date: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-xl)',
        paddingTop: 'var(--spacing-lg)',
        borderTop: '1px solid var(--color-gray-lighter)',
    },
    pageInfo: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
    },
};

export default OrderList;
