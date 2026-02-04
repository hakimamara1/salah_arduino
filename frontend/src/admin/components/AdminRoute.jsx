import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div style={styles.loading}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div style={styles.unauthorized}>
                <h1>❌ Unauthorized</h1>
                <p>You don't have permission to access this page.</p>
                <a href="/" className="btn btn-primary">Go to Home</a>
            </div>
        );
    }

    return children;
};

const styles = {
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 'var(--spacing-md)',
    },
    unauthorized: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
    },
};

export default AdminRoute;
