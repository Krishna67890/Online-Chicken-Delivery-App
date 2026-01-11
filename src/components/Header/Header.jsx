// src/components/Header/Header.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../Contexts/CartContext';
import './Header.css';

const Header = ({ onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemsCount } = useCart();

  const isHomePage = location.pathname === '/home' || location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: '/home', label: 'Home', icon: '🏠' },
    { id: '/home/menu', label: 'Menu', icon: '📋' },
    { id: '/home/offers', label: 'Offers', icon: '🎁' },
    { id: '/home/orders', label: 'Orders', icon: '📦' },
    { id: '/home/profile', label: 'Profile', icon: '👤' },
  ];

  // The header should be transparent ONLY on home page AND when NOT scrolled
  const headerClass = `header ${isHomePage && !isScrolled ? 'transparent' : 'solid'} ${isScrolled ? 'scrolled' : ''}`;

  return (
    <>
      <header className={headerClass}>
        <div className="header-container">
          <div className="logo-container" onClick={() => handleNavigate('/home')}>
            <div className="logo-icon">🍗</div>
            <div className="logo-text">
              <span className="logo-primary">Chicken</span>
              <span className="logo-express-red">Express</span>
            </div>
          </div>

          <nav className="Desktop-nav desktop-only">
            <ul className="nav-list">
              {navItems.map(item => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${location.pathname === item.id ? 'active' : ''}`}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button className="action-btn desktop-only" onClick={() => handleNavigate('/home/profile')}>👤</button>
            <button className="action-btn cart-btn" onClick={() => handleNavigate('/home/orders')}>
              🛒 {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Background Overlay */}
      <div 
        className={`menu-overlay ${isMobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Top Dropdown Mobile Menu */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="logo-container">
            <div className="logo-icon">🍗</div>
            <div className="logo-text">
              <span className="logo-primary">Chicken</span>
              <span className="logo-express-red">Express</span>
            </div>
          </div>
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        
        <ul className="mobile-nav-list">
          {navItems.map(item => (
            <li key={item.id} className="mobile-nav-item">
              <button 
                className={`mobile-nav-link ${location.pathname === item.id ? 'active' : ''}`} 
                onClick={() => handleNavigate(item.id)}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span className="mobile-nav-label">{item.label}</span>
              </button>
            </li>
          ))}
          <li className="mobile-nav-item">
            <button className="mobile-nav-link" onClick={() => handleNavigate('/home/profile')}>
              <span className="mobile-nav-icon">👤</span>
              <span className="mobile-nav-label">Profile Settings</span>
            </button>
          </li>
        </ul>
        
        <div className="mobile-nav-footer">
          <p>© 2026 Chicken Express. All rights reserved by Krishna Patil Rajput.</p>
          <p className="disclaimer">Educational Purpose Only</p>
        </div>
      </nav>
    </>
  );
};

export default Header;