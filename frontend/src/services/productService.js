import api from './api';

export const productService = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        const { data } = await api.get('/products', { params });
        return data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    // Get product by slug
    getProductBySlug: async (slug) => {
        const { data } = await api.get(`/products/slug/${slug}`);
        return data;
    },

    // Add review to product
    addReview: async (productId, reviewData) => {
        const { data } = await api.post(`/products/${productId}/reviews`, reviewData);
        return data;
    },
};

export const categoryService = {
    // Get all categories
    getCategories: async () => {
        const { data } = await api.get('/categories');
        return data;
    },

    // Get single category
    getCategoryById: async (id) => {
        const { data } = await api.get(`/categories/${id}`);
        return data;
    },
};

export const orderService = {
    // Create new order
    createOrder: async (orderData) => {
        const { data } = await api.post('/orders', orderData);
        return data;
    },

    // Get order by ID
    getOrderById: async (id) => {
        const { data } = await api.get(`/orders/${id}`);
        return data;
    },

    // Get user orders
    getMyOrders: async () => {
        const { data } = await api.get('/orders/user/my-orders');
        return data;
    },
};

export const videoService = {
    // Get all videos
    getVideos: async (params = {}) => {
        const { data } = await api.get('/videos', { params });
        return data;
    },

    // Get single video
    getVideoById: async (id) => {
        const { data } = await api.get(`/videos/${id}`);
        return data;
    },

    // Like video
    likeVideo: async (id) => {
        const { data } = await api.post(`/videos/${id}/like`);
        return data;
    },
};
