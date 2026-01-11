// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize with local storage if available
  useEffect(() => {
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserProfile(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Demo Accounts logic
  const demoAccounts = [
    { email: 'krishna@demo.com', name: 'Krishna Patil rajput', password: 'password123' },
    { email: 'atharva@demo.com', name: 'Atharva Patil Rajput', password: 'password123' }
  ];

  const login = async (email, password) => {
    setLoading(true);
    try {
      setAuthError('');
      // Support object or string params based on how it's called
      const emailValue = typeof email === 'object' ? email.email : email;
      const passwordValue = typeof email === 'object' ? email.password : password;
      
      const found = demoAccounts.find(acc => acc.email === emailValue && acc.password === passwordValue);
      
      if (found) {
        const userData = {
          uid: found.email === 'krishna@demo.com' ? 'demo_1' : 'demo_2',
          email: found.email,
          displayName: found.name,
          firstName: found.name.split(' ')[0],
          lastName: found.name.split(' ').slice(1).join(' '),
          isAdmin: true,
          isDemo: true
        };
        
        setCurrentUser(userData);
        setUserProfile(userData);
        setIsAuthenticated(true);
        localStorage.setItem('demo_user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error('Invalid credentials. Use krishna@demo.com or atharva@demo.com');
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        ...userData,
        uid: 'user_' + Date.now(),
        displayName: `${userData.firstName} ${userData.lastName}`,
        isAdmin: false
      };
      setCurrentUser(newUser);
      setUserProfile(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('demo_user');
  };

  const resetPassword = async (email) => {
    console.log('Password reset requested for:', email);
    return true;
  };

  const clearError = () => setAuthError('');

  const value = {
    currentUser,
    user: currentUser,
    userProfile,
    loading,
    authError,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    clearError,
    isAdmin: currentUser?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;