import React from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: adminService.getDashboardStats,
    });

    const { data: recentOrders } = useQuery({
        queryKey: ['recentOrders'],
        queryFn: () => adminService.getRecentOrders(5),
    });

    const { data: lowStock } = useQuery({
        queryKey: ['lowStock'],
        queryFn: adminService.getLowStockProducts,
    });

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={styles.title}>Dashboard Overview</h1>

            {/* Metrics Cards */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <MetricCard
                    title="Total Revenue"
                    value={`${stats?.revenue || 0} DA`}
                    icon="💰"
                    color="var(--color-success)"
                />
                <MetricCard
                    title="Total Orders"
                    value={stats?.orders || 0}
                    icon="📦"
                    color="var(--color-primary)"
                />
                <MetricCard
                    title="Total Products"
                    value={stats?.products || 0}
                    icon="🛍️"
                    color="var(--color-secondary)"
                />
                <MetricCard
                    title="Total Users"
                    value={stats?.users || 0}
                    icon="👥"
                    color="var(--color-info)"
                />
            </div>

            <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Recent Orders */}
                <div className="card">
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Recent Orders</h2>
                        <Link to="/admin/orders" style={styles.viewAll}>View All →</Link>
                    </div>

                    {recentOrders?.data && recentOrders.data.length > 0 ? (
                        <div style={styles.table}>
                            {recentOrders.data.map((order) => (
                                <Link
                                    key={order._id}
                                    to={`/admin/orders/${order._id}`}
                                    style={styles.orderRow}
                                >
                                    <div>
                                        <div style={styles.orderNumber}>#{order.orderNumber}</div>
                                        <div style={styles.orderCustomer}>{order.customer?.name}</div>
                                    </div>
                                    <div style={styles.orderRight}>
                                        <span className={`badge badge-${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <div style={styles.orderTotal}>{order.totalPrice} DA</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.empty}>No recent orders</p>
                    )}
                </div>

                {/* Low Stock Alert */}
                <div className="card">
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Low Stock Products</h2>
                        <Link to="/admin/products" style={styles.viewAll}>View All →</Link>
                    </div>

                    {lowStock?.data && lowStock.data.length > 0 ? (
                        <div style={styles.table}>
                            {lowStock.data.slice(0, 5).map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/admin/products/edit/${product._id}`}
                                    style={styles.productRow}
                                >
                                    <div style={styles.productInfo}>
                                        <div style={styles.productName}>{product.name}</div>
                                        <div style={styles.productSku}>SKU: {product.sku}</div>
                                    </div>
                                    <div style={{
                                        ...styles.stockBadge,
                                        color: product.stock === 0 ? 'var(--color-error)' : 'var(--color-warning)',
                                    }}>
                                        {product.stock} left
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.empty}>All products have sufficient stock</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color }) => (
    <div className="card" style={styles.metricCard}>
        <div style={{ ...styles.metricIcon, backgroundColor: `${color}15`, color }}>
            {icon}
        </div>
        <div>
            <h3 style={styles.metricValue}>{value}</h3>
            <p style={styles.metricTitle}>{title}</p>
        </div>
    </div>
);

const getStatusColor = (status) => {
    const colors = {
        pending: 'warning',
        confirmed: 'info',
        processing: 'primary',
        shipped: 'primary',
        delivered: 'success',
        cancelled: 'error',
    };
    return colors[status] || 'primary';
};

const styles = {
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        marginBottom: 'var(--spacing-2xl)',
    },
    metricCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
    },
    metricIcon: {
        width: '60px',
        height: '60px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
    },
    metricValue: {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        margin: 0,
        color: 'var(--text-primary)',
    },
    metricTitle: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        margin: '0.25rem 0 0',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)',
    },
    cardTitle: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 600,
        margin: 0,
    },
    viewAll: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-primary)',
        textDecoration: 'none',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
    },
    orderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        transition: 'background var(--transition-fast)',
    },
    orderNumber: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 600,
        color: 'var(--text-primary)',
    },
    orderCustomer: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        marginTop: '0.25rem',
    },
    orderRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'var(--spacing-xs)',
    },
    orderTotal: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    productRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        transition: 'background var(--transition-fast)',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        color: 'var(--text-primary)',
    },
    productSku: {
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        marginTop: '0.25rem',
    },
    stockBadge: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
    },
    empty: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        padding: 'var(--spacing-2xl)',
    },
};

export default Dashboard;
