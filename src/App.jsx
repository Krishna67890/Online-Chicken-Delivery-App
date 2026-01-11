// src/App.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { CartProvider } from './Contexts/CartContext';
import { NotificationProvider, useNotifications } from './Contexts/NotificationContext';
import { ThemeProvider, useTheme } from './Contexts/ThemeContext';
import { initServices } from './services';

// Layout Components
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Core Pages
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import About from './pages/About/About';
import Contact from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Reviews from './pages/Reviews';
import SpecialOffers from './pages/SpecialOffers';
import TrackOrder from './pages/TrackOrder';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';

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
import Cart from './components/Cart/Cart';

// Context Providers
import { PreferencesProvider } from "./Contexts/PreferencesContext";
import { LocationProvider } from './Contexts/LocationContext';
import { OffersProvider } from './Contexts/OffersContext';
import { OrderProvider } from './Contexts/OrderContext';

// Styles
import './App.css';

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
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
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
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { showError } = useNotifications();
  const { theme } = useTheme();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [appConfig, setAppConfig] = useState(null);
  const location = useLocation();

  // Load app configuration
  useEffect(() => {
    const loadAppConfig = async () => {
      try {
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
      }
    };
    loadAppConfig();
  }, [showError]);

  const routerContent = useMemo(() => (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/auth/login" replace />} />

      <Route path="/home" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
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
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        
        <Route path="profile" element={<Profile />} />
        <Route path="profile/addresses" element={<AddressBook />} />
        <Route path="profile/orders" element={<OrderHistory />} />
        <Route path="profile/payments" element={<PaymentMethods />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="cart" element={<Cart />} />
      </Route>

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
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      </Route>

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ), [isAuthenticated]);

  if (authLoading || !appConfig) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <div className="loading-content">
          <h1>Chicken Express</h1>
          <p>Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className={`app ${theme}`}>
      <ScrollToTop />
      <OfflineIndicator />
      {routerContent}
    </div>
  );
};

// Main App Component
function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
  }, []);

  if (!appReady) {
    return <LoadingSpinner size="large" />;
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
                    <OrderProvider>
                      <Router>
                        <AppContent />
                      </Router>
                    </OrderProvider>
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