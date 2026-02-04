import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <header style={styles.header}>
            <div style={styles.headerContent}>
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    style={styles.menuButton}
                    className="mobile-menu-btn"
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div style={styles.headerLeft}>
                    <h1 style={styles.pageTitle}>Dashboard</h1>
                </div>

                <div style={styles.headerRight}>
                    {/* User Menu */}
                    <div style={styles.userMenu}>
                        <div style={styles.userInfo}>
                            <span style={styles.userName}>{user?.name}</span>
                            <span style={styles.userRole}>{user?.role}</span>
                        </div>
                        <button onClick={logout} className="btn btn-outline btn-sm" style={styles.logoutBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: 'white',
        borderBottom: '1px solid var(--color-gray-lighter)',
        position: 'sticky',
        top: 0,
        zIndex: 990,
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
        gap: 'var(--spacing-lg)',
    },
    menuButton: {
        display: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 'var(--spacing-sm)',
        color: 'var(--text-primary)',
    },
    headerLeft: {
        flex: 1,
    },
    pageTitle: {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        margin: 0,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--text-primary)',
    },
    userRole: {
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-secondary)',
        textTransform: 'capitalize',
    },
    logoutBtn: {
        gap: 'var(--spacing-xs)',
    },
};

export default AdminHeader;
