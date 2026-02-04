import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>

            <div style={styles.layout}>
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div style={styles.main}>
                    <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                    <main style={styles.content}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
    },
    main: {
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease',
    },
    content: {
        flex: 1,
        padding: 'var(--spacing-xl)',
    },
};

export default AdminLayout;
