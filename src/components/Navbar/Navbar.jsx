// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartItemsCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest('.dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (e, dropdownName) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      // Navigate to orders page where cart functionality now resides
      navigate('/orders');
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>🔥 Free delivery on orders over $25! | Order before 9pm for same-day delivery</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-icon">🍗</div>
            <div className="logo-text">
              <span className="logo-primary">Chicken</span>
              <span className="logo-secondary">Delight</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                <span className="nav-icon">🏠</span>
                Home
              </Link>
            </li>

            <li
              className="nav-item dropdown"
              onClick={(e) => toggleDropdown(e, 'menu')}
            >
              <div className={`nav-link ${isActive('/menu')} ${activeDropdown === 'menu' ? 'active' : ''}`}>
                <span className="nav-icon">📋</span>
                Menu
                <span className="dropdown-arrow">▼</span>
              </div>
              {activeDropdown === 'menu' && (
                <div className="dropdown-menu">
                  <Link to="/menu/fried" className="dropdown-item">🍗 Fried Chicken</Link>
                  <Link to="/menu/grilled" className="dropdown-item">🔥 Grilled Chicken</Link>
                  <Link to="/menu/wings" className="dropdown-item">🍗 Chicken Wings</Link>
                  <Link to="/menu/sandwiches" className="dropdown-item">🥪 Chicken Sandwiches</Link>
                  <Link to="/menu/sides" className="dropdown-item">🍟 Sides & Extras</Link>
                </div>
              )}
            </li>

            <li className="nav-item">
              <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
                <span className="nav-icon">📦</span>
                My Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/about" className={`nav-link ${isActive('/about')}`}>
                <span className="nav-icon">ℹ️</span>
                About Us
              </Link>
            </li>
          </ul>

          {/* Nav Actions */}
          <div className="nav-actions">
            <div className="search-container">
              <button className="action-btn" aria-label="Search">
                <span className="action-icon">🔍</span>
              </button>
            </div>

            <Link to="/account" className="action-btn" aria-label="Account">
              <span className="action-icon">👤</span>
            </Link>

            <button onClick={handleCartClick} className="cart-btn" aria-label="Cart">
              <span className="action-icon">🛒</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            <button
              className="mobile-menu-btn"
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
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <Link to="/" className={`mobile-nav-link ${isActive('/')}`}>
              <span className="mobile-nav-icon">🏠</span>
              Home
            </Link>

            <div className="mobile-nav-section">
              <div className="mobile-nav-header">Our Menu</div>
              <Link to="/menu" className={`mobile-nav-link ${isActive('/menu')}`}>
                <span className="mobile-nav-icon">📋</span>
                All Menu
              </Link>
              <Link to="/menu/fried" className="mobile-nav-link sub-item">
                <span className="mobile-nav-icon">🍗</span>
                Fried Chicken
              </Link>
              <Link to="/menu/grilled" className="mobile-nav-link sub-item">
                <span className="mobile-nav-icon">🔥</span>
                Grilled Chicken
              </Link>
              <Link to="/menu/wings" className="mobile-nav-link sub-item">
                <span className="mobile-nav-icon">🍗</span>
                Chicken Wings
              </Link>
              <Link to="/menu/sandwiches" className="mobile-nav-link sub-item">
                <span className="mobile-nav-icon">🥪</span>
                Chicken Sandwiches
              </Link>
              <Link to="/menu/sides" className="mobile-nav-link sub-item">
                <span className="mobile-nav-icon">🍟</span>
                Sides & Extras
              </Link>
            </div>

            <Link to="/orders" className={`mobile-nav-link ${isActive('/orders')}`}>
              <span className="mobile-nav-icon">📦</span>
              My Orders
            </Link>

            <Link to="/about" className={`nav-link ${isActive('/about')}`}>
              <span className="nav-icon">ℹ️</span>
              About Us
            </Link>

            <button onClick={handleCartClick} className="mobile-nav-link">
              <span className="mobile-nav-icon">🛒</span>
              Cart ({cartItemsCount})
            </button>

            <div className="mobile-actions">
              <button className="mobile-action-btn">
                <span className="mobile-action-icon">🔍</span>
                Search
              </button>
              <Link to="/account" className="mobile-action-btn">
                <span className="mobile-action-icon">👤</span>
                My Account
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
