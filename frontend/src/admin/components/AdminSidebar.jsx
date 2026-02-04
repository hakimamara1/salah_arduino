import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: '📦', label: 'Products' },
        { path: '/admin/orders', icon: '🛒', label: 'Orders' },
        { path: '/admin/categories', icon: '📁', label: 'Categories' },
        { path: '/admin/videos', icon: '🎥', label: 'Videos' },
        { path: '/admin/users', icon: '👥', label: 'Users' },
    ];

    const isActive = (path, exact) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div style={styles.overlay} onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside style={{ ...styles.sidebar, ...(isOpen ? styles.sidebarOpen : {}) }}>
                {/* Logo */}
                <div style={styles.sidebarHeader}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
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
                    <div>
                        <h2 style={styles.sidebarTitle}>Admin Panel</h2>
                        <p style={styles.sidebarSubtitle}>{user?.name}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                ...styles.navItem,
                                ...(isActive(item.path, item.exact) ? styles.navItemActive : {}),
                            }}
                            onClick={() => onClose && onClose()}
                        >
                            <span style={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div style={styles.sidebarFooter}>
                    <Link to="/" style={styles.footerLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Shop
                    </Link>
                </div>
            </aside>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 998,
    },
    sidebar: {
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '260px',
        backgroundColor: 'var(--color-dark)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        transition: 'transform 0.3s ease',
    },
    sidebarOpen: {
        transform: 'translateX(0)',
    },
    sidebarHeader: {
        padding: 'var(--spacing-xl)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
    },
    sidebarTitle: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        margin: 0,
    },
    sidebarSubtitle: {
        fontSize: 'var(--font-size-xs)',
        color: 'rgba(255, 255, 255, 0.6)',
        margin: 0,
    },
    nav: {
        flex: 1,
        padding: 'var(--spacing-md)',
        overflowY: 'auto',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        marginBottom: 'var(--spacing-xs)',
        transition: 'all var(--transition-fast)',
    },
    navItemActive: {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
    },
    navIcon: {
        fontSize: '1.25rem',
    },
    sidebarFooter: {
        padding: 'var(--spacing-lg)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        color: 'rgba(255, 255, 255, 0.6)',
        textDecoration: 'none',
        fontSize: 'var(--font-size-sm)',
    },
};

// Add media query for mobile
const styleSheet = document.styleSheets[0];
if (styleSheet) {
    try {
        styleSheet.insertRule(`
      @media (max-width: 768px) {
        aside[style*="position: fixed"] {
          transform: translateX(-100%);
        }
      }
    `, styleSheet.cssRules ? styleSheet.cssRules.length : 0);
    } catch (e) {
        // Ignore if insertion fails
    }
}

export default AdminSidebar;
