// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider, useCart } from './hooks/useCart';
import { NotificationProvider, useNotifications } from './hooks/useNotifications';
import { ThemeProvider, useTheme } from './hooks/useTheme.js';
import { initServices } from './services';
import { usePayment } from "./hooks/usePayment";

// Layout Components
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Core Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import About from './pages/About/About';
import Contact from './pages/ContactUs';
import FAQ from "./pages/FAQ";
import Reviews from './pages/Reviews';
import SpecialOffers from './pages/SpecialOffers';
import TrackOrder from './pages/TrackOrder';

// Auth Pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Profile Pages
import Profile from './pages/Profile/Profile';
import AddressBook from './pages/Profile/AddressBook';
import OrderHistory from './pages/Profile/OrderHistory';
import PaymentMethods from './pages/Profile/PaymentMethods';

// Order Pages
import Checkout from './pages/Checkout/Checkout';
import Orders from './pages/Orders/Orders';
import OrderDetails from './pages/Orders/OrderDetails';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMenu from './pages/Admin/Menu';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';

// Components
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator/OfflineIndicator';
import MaintenanceMode from './components/MaintenanceMode/MaintenanceMode';

// Context Providers
import { PreferencesProvider } from "./Contexts/PreferencesContext";

import { LocationProvider } from './Contexts/LocationContext';
import { OffersProvider } from './Contexts/OffersContext';

// Styles
import './App.css';

// Initialize services
initServices();

// Route protection components
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
};

// App content component
const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const { showError } = useNotifications();
  const { theme } = useTheme();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [appConfig, setAppConfig] = useState(null);

  // Load app configuration
  useEffect(() => {
    const loadAppConfig = async () => {
      try {
        // In a real app, this would be an API call
        const config = {
          maintenanceMode: false,
          features: {
            onlineOrdering: true,
            delivery: true,
            pickup: true,
            reviews: true,
            loyaltyProgram: true
          },
          businessHours: {
            open: '09:00',
            close: '23:00',
            timezone: 'UTC-5'
          }
        };
        
        setAppConfig(config);
        setMaintenanceMode(config.maintenanceMode);
      } catch (error) {
        showError('Failed to load app configuration');
        console.error('App config loading error:', error);
      }
    };

    loadAppConfig();
  }, [showError]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is back online');
    };

    const handleOffline = () => {
      showError('You are currently offline. Some features may not work.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showError]);

  // Handle service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                console.log('New app update available!');
              }
            });
          }
        });
      });
    }
  }, []);

  // App loading state
  if (authLoading || !appConfig) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <div className="loading-content">
          <h1>Chicken Express</h1>
          <p>Loading delicious chicken options...</p>
        </div>
      </div>
    );
  }

  // Maintenance mode
  if (maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className={`app ${theme}`}>
      <ScrollToTop />
      <OfflineIndicator />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:category" element={<Menu />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reviews/:itemId" element={<Reviews />} />
          <Route path="offers" element={<SpecialOffers />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="track-order/:orderId" element={<TrackOrder />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          
          {/* Protected Profile Routes */}
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile/addresses" element={
            <ProtectedRoute>
              <AddressBook />
            </ProtectedRoute>
          } />
          <Route path="profile/orders" element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="profile/payments" element={
            <ProtectedRoute>
              <PaymentMethods />
            </ProtectedRoute>
          } />
          
          {/* Checkout */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="reset-password" element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="not-found-page">
            <div className="not-found-content">
              <h1>404</h1>
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist or has been moved.</p>
              <div className="not-found-actions">
                <button 
                  className="btn-primary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => window.location.href = '/'}
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

// Main App Component
function App() {
  const [appReady, setAppReady] = useState(false);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Preload critical resources
        await preloadCriticalResources();
        
        // Initialize service worker for PWA
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        }

        setAppReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setAppReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(async () => {
    const criticalResources = [
      // Add paths to critical resources like fonts, images, etc.
    ];

    await Promise.all(
      criticalResources.map(resource => {
        return new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource;
          link.onload = resolve;
          link.onerror = reject;
          document.head.appendChild(link);
        });
      })
    );
  }, []);

  if (!appReady) {
    return (
      <div className="app-initializing">
        <div className="initializing-content">
          <div className="logo">
            <span className="logo-icon">🍗</span>
            <h1>Chicken Express</h1>
          </div>
          <LoadingSpinner size="large" />
          <p>Preparing your chicken experience...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <PreferencesProvider>
                <LocationProvider>
                  <OffersProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </OffersProvider>
                </LocationProvider>
              </PreferencesProvider>
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;