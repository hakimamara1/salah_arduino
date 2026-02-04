import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { getCartItemsCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartCount = getCartItemsCount();

    return (
        <>
            <style>{`
        @media (max-width: 768px) {
          header nav:not(.mobile-open) {
            display: none !important;
          }
          header button.menu-button {
            display: block !important;
          }
          header .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
            <header style={styles.header}>
                <div className="container flex items-center justify-between" style={styles.headerInner}>
                    {/* Logo */}
                    <Link to="/" style={styles.logo}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
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
                        <span style={styles.logoText}>Arduino Shop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav style={styles.nav} className={isMenuOpen ? 'mobile-open' : ''}>
                        <Link to="/" style={styles.navLink}>
                            Home
                        </Link>
                        <Link to="/videos" style={styles.navLink}>
                            Video Tutorials
                        </Link>
                        <Link to="/cart" style={styles.navLink}>
                            <div style={styles.cartWrapper}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M9 2L7.17 4H3.5C2.67 4 2 4.67 2 5.5V6.5C2 7.33 2.67 8 3.5 8H20.5C21.33 8 22 7.33 22 6.5V5.5C22 4.67 21.33 4 20.5 4H16.83L15 2H9Z" />
                                    <path d="M3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8" />
                                </svg>
                                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                            </div>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="menu-button"
                        style={styles.menuButton}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mobile-menu" style={styles.mobileMenu}>
                        <Link to="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link
                            to="/videos"
                            style={styles.mobileLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Video Tutorials
                        </Link>
                        <Link to="/cart" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                            Cart ({cartCount})
                        </Link>
                    </div>
                )}
            </header>
        </>
    );
};

const styles = {
    header: {
        background: 'rgba(26, 41, 66, 0.95)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
        animation: 'slideDown 0.6s ease-out',
    },
    headerInner: {
        padding: '1.5rem 0',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.8rem',
        fontWeight: 700,
        fontFamily: "'Space Mono', monospace",
        color: 'var(--text-primary)',
        textDecoration: 'none',
    },
    logoText: {
        background: 'var(--gradient-glow)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem',
    },
    navLink: {
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
    },
    cartWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: 'var(--warm-orange)',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 700,
    },
    menuButton: {
        display: 'none',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: 'var(--text-primary)',
    },
    mobileMenu: {
        display: 'none',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: 'rgba(26, 41, 66, 0.98)',
        borderTop: '1px solid rgba(0, 217, 255, 0.2)',
    },
    mobileLink: {
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 500,
        textDecoration: 'none',
        padding: '0.5rem',
    },
};

export default Header;

