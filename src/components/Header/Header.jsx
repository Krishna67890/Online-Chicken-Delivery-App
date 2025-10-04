// src/components/Header/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ cartItemsCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Navigation handler
  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { id: '/', label: 'Home', icon: '🏠' },
    { id: '/menu', label: 'Menu', icon: '📋' },
    { id: '/about', label: 'About', icon: 'ℹ️' },
    { id: '/contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>🔥 Free delivery on orders over $25! | Order before 9pm for same-day delivery</span>
        </div>
      </div>

      {/* Main header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <div className="logo" onClick={() => handleNavigate('/')}>
            <div className="logo-icon">🍗</div>
            <div className="logo-text">
              <span className="logo-primary">Chicken</span>
              <span className="logo-secondary">Delight</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navItems.map(item => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${window.location.pathname === item.id ? 'active' : ''}`}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Search */}
            <div className="search-container" ref={searchRef}>
              <button 
                className="action-btn search-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <span className="action-icon">🔍</span>
              </button>
              
              <div className={`search-box ${isSearchOpen ? 'open' : ''}`}>
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-submit">
                    <span className="action-icon">🔍</span>
                  </button>
                </form>
              </div>
            </div>

            {/* User Account */}
            <button 
              className="action-btn user-account" 
              aria-label="Account"
              onClick={() => handleNavigate('/account')}
            >
              <span className="action-icon">👤</span>
            </button>

            {/* Cart */}
            <button 
              className="action-btn cart-btn"
              onClick={onCartClick}
              aria-label="Shopping cart"
            >
              <span className="action-icon">🛒</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-list">
            {navItems.map(item => (
              <li key={item.id} className="mobile-nav-item">
                <button
                  className={`mobile-nav-link ${window.location.pathname === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                </button>
              </li>
            ))}
            
            {/* Additional mobile-only items */}
            <li className="mobile-nav-item">
              <button 
                className="mobile-nav-link"
                onClick={() => handleNavigate('/offers')}
              >
                <span className="mobile-nav-icon">⭐</span>
                <span className="mobile-nav-label">Special Offers</span>
              </button>
            </li>
            <li className="mobile-nav-item">
              <button 
                className="mobile-nav-link"
                onClick={() => handleNavigate('/orders')}
              >
                <span className="mobile-nav-icon">📦</span>
                <span className="mobile-nav-label">My Orders</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;