/**
 * Mock Authentication Service for Development
 * This provides demo accounts when Firebase is not properly configured
 */

// Mock user data for demo accounts
const mockUsers = {
  'krishna.patil@example.com': {
    uid: 'demo_krishna_123',
    email: 'krishna.patil@example.com',
    displayName: 'Krishna Patil Rajput',
    firstName: 'Krishna',
    lastName: 'Patil Rajput',
    photoURL: null,
    emailVerified: true,
    phoneNumber: '+1234567890',
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    }
  },
  'atharva.patil@example.com': {
    uid: 'demo_atharva_456',
    email: 'atharva.patil@example.com',
    displayName: 'Atharva Patil Rajput',
    firstName: 'Atharva',
    lastName: 'Patil Rajput',
    photoURL: null,
    emailVerified: true,
    phoneNumber: '+1234567891',
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    }
  }
};

// Mock user profiles for Firestore
const mockUserProfiles = {
  'demo_krishna_123': {
    uid: 'demo_krishna_123',
    email: 'krishna.patil@example.com',
    firstName: 'Krishna',
    lastName: 'Patil Rajput',
    phone: '+1234567890',
    addresses: [
      {
        id: 'addr_demo_1',
        street: '123 Demo Street',
        city: 'Demo City',
        state: 'DC',
        zipCode: '12345',
        type: 'home',
        isDefault: true
      }
    ],
    favoriteItems: ['item_1', 'item_2'],
    orderHistory: [],
    preferences: {
      spicyLevel: 'medium',
      favoriteCuts: ['thigh', 'breast'],
      specialInstructions: 'Leave at door',
      notifications: {
        email: true,
        sms: true,
        promotions: true
      }
    },
    loyaltyPoints: 150,
    totalOrders: 5,
    totalSpent: 125.50,
    isEmailVerified: true,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    lastOrderDate: new Date(Date.now() - 86400000).toISOString() // yesterday
  },
  'demo_atharva_456': {
    uid: 'demo_atharva_456',
    email: 'atharva.patil@example.com',
    firstName: 'Atharva',
    lastName: 'Patil Rajput',
    phone: '+1234567891',
    addresses: [
      {
        id: 'addr_demo_2',
        street: '456 Demo Avenue',
        city: 'Demo Town',
        state: 'DT',
        zipCode: '54321',
        type: 'work',
        isDefault: true
      }
    ],
    favoriteItems: ['item_3', 'item_4'],
    orderHistory: [],
    preferences: {
      spicyLevel: 'hot',
      favoriteCuts: ['wing', 'drumstick'],
      specialInstructions: 'Call when arrived',
      notifications: {
        email: true,
        sms: false,
        promotions: true
      }
    },
    loyaltyPoints: 95,
    totalOrders: 3,
    totalSpent: 78.25,
    isEmailVerified: true,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    lastOrderDate: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
};

// Simple storage for mock auth state
let currentUser = null;

export const mockAuth = {
  // Mock authentication methods
  login: async (email, password) => {
    // Simple validation - in a real app, this would be more secure
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = mockUsers[email.toLowerCase()];
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // For demo purposes, accept any password for demo accounts
    // In a real app, you would validate the actual password
    if (!email.includes('patil')) {
      throw new Error('Demo accounts only. Please use krishna.patil@example.com or atharva.patil@example.com');
    }

    currentUser = { ...user };
    
    // Update last login in profile
    if (mockUserProfiles[user.uid]) {
      mockUserProfiles[user.uid].lastLogin = new Date().toISOString();
    }

    return currentUser;
  },

  logout: async () => {
    currentUser = null;
  },

  register: async (email, password, userData) => {
    // For demo purposes, we'll only allow registration of demo-like accounts
    if (!email.includes('patil')) {
      throw new Error('Demo mode - only demo accounts allowed');
    }

    const newUser = {
      uid: `demo_${Date.now()}`,
      email: email,
      displayName: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photoURL: null,
      emailVerified: true,
      phoneNumber: userData.phone || '+1234567890',
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      }
    };

    const newProfile = {
      uid: newUser.uid,
      email: newUser.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '+1234567890',
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
      isEmailVerified: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      lastOrderDate: null
    };

    mockUsers[email] = newUser;
    mockUserProfiles[newUser.uid] = newProfile;
    currentUser = newUser;

    return newUser;
  },

  getCurrentUser: () => {
    return currentUser;
  },

  getCurrentUserProfile: () => {
    if (!currentUser) return null;
    return mockUserProfiles[currentUser.uid] || null;
  },

  updateProfile: async (updates) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    Object.assign(currentUser, updates);
    if (mockUserProfiles[currentUser.uid]) {
      Object.assign(mockUserProfiles[currentUser.uid], updates);
    }

    return currentUser;
  },

  resetPassword: async (email) => {
    if (!mockUsers[email]) {
      throw new Error('User not found');
    }
    // In a real app, this would send a password reset email
    console.log(`Password reset requested for ${email}`);
    return true;
  },

  // Methods to access mock data
  getAllMockUsers: () => mockUsers,
  getMockUserProfile: (uid) => mockUserProfiles[uid],
  setMockUserProfile: (uid, profile) => {
    mockUserProfiles[uid] = profile;
  }
};

export default mockAuth;