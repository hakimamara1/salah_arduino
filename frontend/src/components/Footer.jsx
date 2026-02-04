import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container">
                <div style={styles.footerContent}>
                    {/* About Section */}
                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Arduino Shop</h3>
                        <p style={styles.description}>
                            Your trusted source for Arduino components, sensors, modules, and development
                            boards. Learn and build with our comprehensive video tutorials.
                        </p>
                        <div style={styles.social}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Quick Links</h3>
                        <ul style={styles.linkList}>
                            <li><Link to="/" style={styles.link}>Home</Link></li>
                            <li><Link to="/videos" style={styles.link}>Video Tutorials</Link></li>
                            <li><Link to="/cart" style={styles.link}>Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Categories</h3>
                        <ul style={styles.linkList}>
                            <li><Link to="/?category=sensors" style={styles.link}>Sensors</Link></li>
                            <li><Link to="/?category=modules" style={styles.link}>Modules</Link></li>
                            <li><Link to="/?category=boards" style={styles.link}>Development Boards</Link></li>
                            <li><Link to="/?category=accessories" style={styles.link}>Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Contact Us</h3>
                        <ul style={styles.linkList}>
                            <li style={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>contact@arduinoshop.com</span>
                            </li>
                            <li style={styles.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <span>+213 XXX XXX XXX</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={styles.bottom}>
                    <p style={styles.copyright}>
                        © {new Date().getFullYear()} Arduino Shop. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        background: 'linear-gradient(135deg, var(--color-dark), var(--color-dark-light))',
        color: 'var(--text-inverse)',
        padding: 'var(--spacing-3xl) 0 var(--spacing-lg)',
        marginTop: 'var(--spacing-3xl)',
    },
    footerContent: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-2xl)',
        marginBottom: 'var(--spacing-2xl)',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
    },
    columnTitle: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        marginBottom: 'var(--spacing-sm)',
    },
    description: {
        fontSize: 'var(--font-size-sm)',
        lineHeight: 1.6,
        color: 'var(--color-gray-light)',
    },
    social: {
        display: 'flex',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-sm)',
    },
    socialLink: {
        color: 'var(--text-inverse)',
        transition: 'color var(--transition-fast)',
        opacity: 0.8,
    },
    linkList: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
    },
    link: {
        color: 'var(--color-gray-light)',
        fontSize: 'var(--font-size-sm)',
        textDecoration: 'none',
        transition: 'color var(--transition-fast)',
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        color: 'var(--color-gray-light)',
        fontSize: 'var(--font-size-sm)',
    },
    bottom: {
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: 'var(--spacing-lg)',
        textAlign: 'center',
    },
    copyright: {
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-gray-light)',
    },
};

export default Footer;
