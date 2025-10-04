// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

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

  // Register new user
  const register = async (email, password, userData) => {
    try {
      setAuthError('');
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        addresses: userData.addresses || [],
        favoriteItems: [],
        orderHistory: [],
        preferences: {
          spicyLevel: 'medium',
          favoriteCuts: [],
          specialInstructions: '',
          notifications: {
            email: true,
            sms: true,
            promotions: true
          }
        },
        loyaltyPoints: 0,
        totalOrders: 0,
        totalSpent: 0,
        isEmailVerified: false,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastOrderDate: null
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile(userProfileData);
      
      return user;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setAuthError('');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setAuthError('');
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      setAuthError('Failed to logout');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setAuthError('');
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...updates
      }));

      // Update auth profile if display name changed
      if (updates.firstName && updates.lastName) {
        await updateProfile(currentUser, {
          displayName: `${updates.firstName} ${updates.lastName}`
        });
      }
    } catch (error) {
      setAuthError('Failed to update profile');
      throw error;
    }
  };

  // Add new address
  const addAddress = async (newAddress) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const addressId = `addr_${Date.now()}`;
      const addressWithId = {
        ...newAddress,
        id: addressId,
        isDefault: userProfile?.addresses?.length === 0
      };

      const updatedAddresses = [...(userProfile?.addresses || []), addressWithId];
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        addresses: updatedAddresses
      });

      setUserProfile(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));

      return addressId;
    } catch (error) {
      setAuthError('Failed to add address');
      throw error;
    }
  };

  // Update address
  const updateAddress = async (addressId, updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedAddresses = userProfile.addresses.map(address =>
        address.id === addressId ? { ...address, ...updates } : address
      );

      await updateDoc(doc(db, 'users', currentUser.uid), {
        addresses: updatedAddresses
      });

      setUserProfile(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
    } catch (error) {
      setAuthError('Failed to update address');
      throw error;
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedAddresses = userProfile.addresses.filter(
        address => address.id !== addressId
      );

      await updateDoc(doc(db, 'users', currentUser.uid), {
        addresses: updatedAddresses
      });

      setUserProfile(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
    } catch (error) {
      setAuthError('Failed to delete address');
      throw error;
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedAddresses = userProfile.addresses.map(address => ({
        ...address,
        isDefault: address.id === addressId
      }));

      await updateDoc(doc(db, 'users', currentUser.uid), {
        addresses: updatedAddresses
      });

      setUserProfile(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
    } catch (error) {
      setAuthError('Failed to set default address');
      throw error;
    }
  };

  // Add to favorites
  const addToFavorites = async (itemId) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedFavorites = [...new Set([...(userProfile.favoriteItems || []), itemId])];
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        favoriteItems: updatedFavorites
      });

      setUserProfile(prev => ({
        ...prev,
        favoriteItems: updatedFavorites
      }));
    } catch (error) {
      setAuthError('Failed to add to favorites');
      throw error;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (itemId) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedFavorites = (userProfile.favoriteItems || []).filter(id => id !== itemId);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        favoriteItems: updatedFavorites
      });

      setUserProfile(prev => ({
        ...prev,
        favoriteItems: updatedFavorites
      }));
    } catch (error) {
      setAuthError('Failed to remove from favorites');
      throw error;
    }
  };

  // Update preferences
  const updatePreferences = async (preferences) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        preferences: {
          ...userProfile.preferences,
          ...preferences
        }
      });

      setUserProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      }));
    } catch (error) {
      setAuthError('Failed to update preferences');
      throw error;
    }
  };

  // Clear auth error
  const clearError = () => {
    setAuthError('');
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser.uid);
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        setUserProfile(profileData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthError('Failed to load user profile');
    }
  };

  // Check if user is admin
  const checkAdminStatus = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() && userDoc.data().isAdmin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
        
        // Check and update email verification status
        if (user.emailVerified && (!userProfile || !userProfile.isEmailVerified)) {
          await updateDoc(doc(db, 'users', user.uid), {
            isEmailVerified: true
          });
        }
      } else {
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/invalid-credential': 'Invalid login credentials.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  };

  const value = {
    // User state
    currentUser,
    user: currentUser, // alias for compatibility
    userProfile,
    loading,
    authError,
    isAuthenticated,
    
    // Auth methods
    register,
    login,
    logout,
    resetPassword,
    
    // Profile methods
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Favorites methods
    addToFavorites,
    removeFromFavorites,
    
    // Preferences methods
    updatePreferences,
    
    // Utility methods
    clearError,
    refreshUserData,
    checkAdminStatus,
    
    // Helper properties
    hasAddresses: userProfile?.addresses?.length > 0,
    defaultAddress: userProfile?.addresses?.find(addr => addr.isDefault) || userProfile?.addresses?.[0],
    favoriteItems: userProfile?.favoriteItems || [],
    isAdmin: userProfile?.isAdmin || false,
    isEmailVerified: currentUser?.emailVerified || userProfile?.isEmailVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;