import api from './api';

// Dashboard stats
export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};

export const getRecentOrders = async (limit = 10) => {
    const response = await api.get(`/admin/dashboard/recent-orders?limit=${limit}`);
    return response.data;
};

export const getSalesChart = async (days = 30) => {
    const response = await api.get(`/admin/dashboard/sales-chart?days=${days}`);
    return response.data;
};

export const getLowStockProducts = async () => {
    const response = await api.get('/admin/dashboard/low-stock');
    return response.data;
};

// Product management
export const getAllProducts = async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const bulkDeleteProducts = async (ids) => {
    const response = await api.post('/products/bulk/delete', { ids });
    return response.data;
};

// Order management
export const getAllOrders = async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
};

export const exportOrders = async (format = 'csv') => {
    const response = await api.get(`/admin/orders/export?format=${format}`, {
        responseType: 'blob',
    });
    return response.data;
};

// Analytics
export const getTopProducts = async (limit = 10) => {
    const response = await api.get(`/admin/analytics/top-products?limit=${limit}`);
    return response.data;
};

export default {
    getDashboardStats,
    getRecentOrders,
    getSalesChart,
    getLowStockProducts,
    getAllProducts,
    deleteProduct,
    bulkDeleteProducts,
    getAllOrders,
    updateOrderStatus,
    exportOrders,
    getTopProducts,
};
