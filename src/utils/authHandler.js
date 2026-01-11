/**
 * Authentication Handler
 * Handles both Firebase and Mock authentication
 */

// Try to initialize Firebase, fallback to mock if unavailable
let authInstance = null;
let dbInstance = null;
let firebaseFunctions = null;
let mockAuthInstance = null;

// Initialize Firebase if available
try {
  const firebaseModule = require('../config/firebase');
  authInstance = firebaseModule.auth;
  dbInstance = firebaseModule.db;
  
  // Import Firebase functions
  const authFunctions = require('firebase/auth');
  const firestoreFunctions = require('firebase/firestore');
  
  firebaseFunctions = {
    ...authFunctions,
    ...firestoreFunctions
  };
} catch (error) {
  console.warn('Firebase not available, using mock auth:', error.message);
}

// Initialize mock auth
try {
  const mockAuthModule = require('../config/mockAuth');
  mockAuthInstance = mockAuthModule.mockAuth;
} catch (error) {
  console.error('Mock auth not available:', error.message);
}

// Check if Firebase is available
const isFirebaseAvailable = !!(authInstance && dbInstance && firebaseFunctions);

/**
 * Get the appropriate auth service based on availability
 */
export const getAuthService = () => {
  if (isFirebaseAvailable) {
    return {
      type: 'firebase',
      auth: authInstance,
      db: dbInstance,
      functions: firebaseFunctions
    };
  } else {
    return {
      type: 'mock',
      auth: mockAuthInstance,
      functions: null
    };
  }
};

/**
 * Authentication wrapper functions
 */
export const authWrapper = {
  // Sign in with email and password
  signIn: async (email, password) => {
    if (isFirebaseAvailable) {
      const { signInWithEmailAndPassword } = firebaseFunctions;
      return await signInWithEmailAndPassword(authInstance, email, password);
    } else {
      return await mockAuthInstance.login(email, password);
    }
  },

  // Create user with email and password
  signUp: async (email, password, userData) => {
    if (isFirebaseAvailable) {
      const { createUserWithEmailAndPassword, updateProfile } = firebaseFunctions;
      const { doc, setDoc } = firebaseFunctions;
      
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
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
        loyaltyPoints: 100, // Welcome bonus
        totalOrders: 0,
        totalSpent: 0,
        isEmailVerified: false,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastOrderDate: null
      };
      
      await setDoc(doc(dbInstance, 'users', user.uid), userProfileData);
      return user;
    } else {
      return await mockAuthInstance.register(email, password, userData);
    }
  },

  // Sign out
  signOut: async () => {
    if (isFirebaseAvailable) {
      const { signOut } = firebaseFunctions;
      return await signOut(authInstance);
    } else {
      return await mockAuthInstance.logout();
    }
  },

  // Send password reset
  sendPasswordReset: async (email) => {
    if (isFirebaseAvailable) {
      const { sendPasswordResetEmail } = firebaseFunctions;
      return await sendPasswordResetEmail(authInstance, email);
    } else {
      return await mockAuthInstance.resetPassword(email);
    }
  },

  // Update profile
  updateProfile: async (user, updates) => {
    if (isFirebaseAvailable) {
      const { updateProfile, updateDoc, doc } = firebaseFunctions;
      
      if (updates.firstName && updates.lastName) {
        await updateProfile(user, {
          displayName: `${updates.firstName} ${updates.lastName}`
        });
      }
      
      await updateDoc(doc(dbInstance, 'users', user.uid), updates);
    } else {
      return await mockAuthInstance.updateProfile(updates);
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    if (isFirebaseAvailable) {
      const { getDoc, doc } = firebaseFunctions;
      const userDoc = await getDoc(doc(dbInstance, 'users', userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } else {
      return mockAuthInstance.getMockUserProfile(userId);
    }
  },

  // On auth state change listener
  onAuthStateChanged: (callback) => {
    if (isFirebaseAvailable) {
      const { onAuthStateChanged } = firebaseFunctions;
      return onAuthStateChanged(authInstance, callback);
    } else {
      // For mock auth, we'll simulate the auth state
      // This is a simplified version - in a real scenario you'd handle this differently
      const currentUser = mockAuthInstance.getCurrentUser();
      callback(currentUser);
      
      // Return a mock unsubscribe function
      return () => {};
    }
  }
};

export default authWrapper;