import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { assets } from '../assets/assets';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState('HOME');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkDarkSections = () => {
      const darkSelectors = '.coll-hero, [data-dark-nav="true"]';
      const darkEls = document.querySelectorAll(darkSelectors);
      if (!darkEls.length) {
        setOnDark(false);
        return;
      }
      const navHeight = 90;
      const anyDark = Array.from(darkEls).some(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < navHeight && rect.bottom > 0;
      });
      setOnDark(anyDark);
    };

    const timer = setTimeout(checkDarkSections, 50);
    window.addEventListener('scroll', checkDarkSections, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkDarkSections);
    };
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActive('HOME');
    else if (path.includes('about')) setActive('ABOUT US');
    else if (path.includes('collection')) setActive('PRODUCTS');
    else if (path.includes('gifting')) setActive('GIFTING');
    else if (path.includes('contact')) setActive('CONTACT');
    else setActive('');
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = ['HOME', 'ABOUT US', 'PRODUCTS', 'GIFTING', 'CONTACT'];

  const itemPath = (item) =>
    item === 'HOME' ? '/' :
    item === 'ABOUT US' ? '/about' :
    item === 'PRODUCTS' ? '/collection' :
    item === 'GIFTING' ? '/gifting' :
    item === 'CONTACT' ? '/contact' : '/';

  return (
    <>
      <nav className={`main-navbar ${isScrolled ? 'scrolled' : ''} ${onDark ? 'nav-on-dark' : 'nav-on-light'}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo-link" aria-label="Home">
            <img src={assets.logo} alt="Sapling & Seeds Logo" className="nav-logo-img" width="46" height="46" />
          </Link>
          <ul className="nav-links-list">
            {navItems.map((item) => (
              <li key={item}>
                <Link to={itemPath(item)} className={active === item ? 'active' : ''}>
                  {item}
                  {active === item && <div className="nav-active-underline" />}
                </Link>
              </li>
            ))}

            <li className="nav-cart-item">
              <Link to="/cart" className="nav-cart-link" aria-label="Shopping Cart">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cart-icon-svg"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </li>

            <li className="auth-nav-group">
              {user ? (
                <div className="user-profile-group">
                  <Link to="/profile" className="user-name-badge" onClick={closeMenu} aria-label="User Profile">
                    <span className="btn-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <span className="btn-text">{user.name.split(' ')[0].toUpperCase()}</span>
                  </Link>
                  <button className="logout-nav-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-svg">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-nav-btn" aria-label="Login">
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                  <span className="btn-text">LOGIN</span>
                </Link>
              )}
            </li>

            <li className="mobile-menu-toggle">
              <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open Navigation Menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className={`mobile-menu-overlay${mobileMenuOpen ? ' is-open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-header">
          <img src={assets.logo} alt="Logo" className="mobile-logo" />
          <button className="close-menu-btn" onClick={closeMenu} aria-label="Close menu">✕</button>
        </div>
        <ul className="mobile-nav-links">
          {navItems.map((item) => (
            <li key={item}>
              <Link
                to={itemPath(item)}
                className={active === item ? 'active' : ''}
                onClick={closeMenu}
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-auth-section">
          {user ? (
            <div className="mobile-user-info">
              <div className="user-profile-group">
                <Link to="/profile" className="user-name-badge" onClick={closeMenu} tabIndex={mobileMenuOpen ? 0 : -1}>
                  {user.name.split(' ')[0].toUpperCase()}
                </Link>
                <button className="logout-nav-btn" onClick={handleLogout} title="Logout" tabIndex={mobileMenuOpen ? 0 : -1}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-nav-btn mobile-login" onClick={closeMenu} tabIndex={mobileMenuOpen ? 0 : -1}>LOGIN</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
