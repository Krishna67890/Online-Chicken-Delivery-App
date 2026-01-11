/**
 * Demo Account Setup Script
 * This script demonstrates how to create demo users in Firebase
 * NOTE: This should typically be run from a Node.js environment with admin privileges
 */

import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDocs,
  collection 
} from 'firebase/firestore';

// Demo user accounts
const demoUsers = [
  {
    email: 'krishna.patil@example.com',
    password: 'DemoPass123!',
    firstName: 'Krishna',
    lastName: 'Patil Rajput',
    phone: '+1234567890',
    displayName: 'Krishna Patil Rajput'
  },
  {
    email: 'atharva.patil@example.com',
    password: 'DemoPass123!',
    firstName: 'Atharva',
    lastName: 'Patil Rajput',
    phone: '+1234567891',
    displayName: 'Atharva Patil Rajput'
  }
];

/**
 * Creates a demo user in Firebase Authentication and Firestore
 * @param {Object} userData - User data including email, password, and profile info
 */
async function createDemoUser(userData) {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Update display name in Firebase Auth
    await updateProfile(user, {
      displayName: userData.displayName
    });
    
    // Create user profile in Firestore
    const userProfileData = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      addresses: [],
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
      loyaltyPoints: 150, // Starting bonus points
      totalOrders: 0,
      totalSpent: 0,
      isEmailVerified: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      lastOrderDate: null
    };
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), userProfileData);
    
    console.log(`Demo user created successfully: ${userData.displayName} (${userData.email})`);
    return { success: true, user: userProfileData };
  } catch (error) {
    console.error(`Error creating demo user ${userData.email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sets up all demo users
 */
async function setupDemoAccounts() {
  console.log('Starting demo account setup...');
  
  const results = [];
  
  for (const userData of demoUsers) {
    console.log(`Creating demo user: ${userData.displayName}`);
    const result = await createDemoUser(userData);
    results.push({ email: userData.email, ...result });
  }
  
  console.log('Demo account setup completed!');
  console.table(results.map(r => ({
    Email: r.email,
    Success: r.success,
    Error: r.error || 'None'
  })));
  
  return results;
}

/**
 * Checks if demo users already exist
 */
async function checkExistingDemoUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const existingUsers = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (demoUsers.some(demo => demo.email === userData.email)) {
        existingUsers.push({
          email: userData.email,
          displayName: userData.firstName + ' ' + userData.lastName
        });
      }
    });
    
    return existingUsers;
  } catch (error) {
    console.error('Error checking existing demo users:', error);
    return [];
  }
}

/**
 * Main function to run the demo setup
 */
async function runDemoSetup() {
  console.log('Checking for existing demo users...');
  const existingUsers = await checkExistingDemoUsers();
  
  if (existingUsers.length > 0) {
    console.log('Existing demo users found:');
    existingUsers.forEach(user => {
      console.log(`- ${user.displayName} (${user.email})`);
    });
    console.log('Skipping creation of demo users as they already exist.');
    return existingUsers;
  }
  
  console.log('No existing demo users found. Creating new demo accounts...');
  return await setupDemoAccounts();
}

// Export functions for use in other modules
export {
  demoUsers,
  createDemoUser,
  setupDemoAccounts,
  checkExistingDemoUsers,
  runDemoSetup
};

// For direct execution (when run as a script)
if (typeof window === 'undefined') {
  // This ensures the script only runs in Node.js environment
  // Note: This won't work directly in the browser due to Firebase Admin SDK requirements
  console.log('Demo setup utilities loaded. Use these functions in an appropriate environment.');
}

console.log('Demo setup utilities are ready to use.');
export default runDemoSetup;