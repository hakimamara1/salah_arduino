import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Public pages - Lazy load for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const VideoLearnerPage = lazy(() => import('./pages/VideoLearnerPage'));
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

// Admin pages
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductList = lazy(() => import('./admin/pages/ProductList'));
const ProductCreate = lazy(() => import('./admin/pages/ProductCreate'));
const ProductEdit = lazy(() => import('./admin/pages/ProductEdit'));
const OrderList = lazy(() => import('./admin/pages/OrderList'));
const OrderDetail = lazy(() => import('./admin/pages/OrderDetail'));
const CategoryList = lazy(() => import('./admin/pages/CategoryList'));
const VideoList = lazy(() => import('./admin/pages/VideoList'));
const VideoCreate = lazy(() => import('./admin/pages/VideoCreate'));
const VideoEdit = lazy(() => import('./admin/pages/VideoEdit'));
const UserList = lazy(() => import('./admin/pages/UserList'));
const AdminRoute = lazy(() => import('./admin/components/AdminRoute'));

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/*"
                            element={
                                <div className="app">
                                    <Header />
                                    <main>
                                        <Routes>
                                            <Route path="/" element={<HomePage />} />
                                            <Route path="/products/:slug" element={<ProductDetailsPage />} />
                                            <Route path="/videos" element={<VideoLearnerPage />} />
                                            <Route path="/videos/:id" element={<VideoPlayerPage />} />
                                            <Route path="/cart" element={<CartPage />} />
                                            <Route path="/checkout" element={<CheckoutPage />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </div>
                            }
                        />

                        {/* Admin Login */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <AdminLayout />
                                </AdminRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<ProductList />} />
                            <Route path="products/create" element={<ProductCreate />} />
                            <Route path="products/edit/:id" element={<ProductEdit />} />
                            <Route path="orders" element={<OrderList />} />
                            <Route path="orders/:id" element={<OrderDetail />} />
                            <Route path="categories" element={<CategoryList />} />
                            <Route path="videos" element={<VideoList />} />
                            <Route path="videos/create" element={<VideoCreate />} />
                            <Route path="videos/edit/:id" element={<VideoEdit />} />
                            <Route path="users" element={<UserList />} />
                        </Route>
                    </Routes>
                </Suspense>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
