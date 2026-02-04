import React from 'react';

const UserList = () => {
    return (
        <div>
            <h1 style={styles.title}>User Management</h1>
            <div className="card" style={styles.comingSoon}>
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h2>Coming Soon</h2>
                <p>User management functionality will be available in the next update.</p>
            </div>
        </div>
    );
};

const styles = {
    title: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 700,
        marginBottom: 'var(--spacing-2xl)',
    },
    comingSoon: {
        textAlign: 'center',
        padding: 'var(--spacing-3xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
    },
};

export default UserList;
