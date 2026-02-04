import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox} className="card">
                {/* Logo */}
                <div style={styles.logo}>
                    <svg width="60" height="60" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="8" fill="url(#gradient)" />
                        <path
                            d="M20 10L12 14V20C12 25 16 28 20 30C24 28 28 25 28 20V14L20 10Z"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                                <stop stopColor="#00979d" />
                                <stop offset="1" stopColor="#e47128" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <h1 style={styles.title}>Admin Login</h1>
                <p style={styles.subtitle}>Sign in to access the admin dashboard</p>

                {error && (
                    <div style={styles.error}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="admin@arduinoshop.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <a href="/" style={styles.link}>← Back to Shop</a>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(0, 151, 157, 0.05), rgba(228, 113, 40, 0.05))',
        padding: 'var(--spacing-lg)',
    },
    loginBox: {
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--spacing-2xl)',
    },
    logo: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)',
    },
    title: {
        textAlign: 'center',
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        marginBottom: 'var(--spacing-sm)',
    },
    subtitle: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-xl)',
    },
    error: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: 'var(--color-error)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-lg)',
        fontSize: 'var(--font-size-sm)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)',
    },
    label: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--text-primary)',
    },
    footer: {
        marginTop: 'var(--spacing-xl)',
        textAlign: 'center',
    },
    link: {
        color: 'var(--color-primary)',
        textDecoration: 'none',
        fontSize: 'var(--font-size-sm)',
    },
};

export default AdminLogin;
