# Demo Accounts Setup Guide

This guide explains how to set up the demo accounts for Krishna Patil Rajput and Atharva Patil Rajput.

## Method 1: Using Firebase Console (Recommended)

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Authentication" in the left sidebar
4. Click on "Users" tab

### Step 2: Create Demo Users Manually
For each demo user, create an account with the following details:

#### Demo User 1: Krishna Patil Rajput
- **Email**: krishna.patil@example.com
- **Password**: DemoPass123!
- **Display Name**: Krishna Patil Rajput

#### Demo User 2: Atharva Patil Rajput
- **Email**: atharva.patil@example.com
- **Password**: DemoPass123!
- **Display Name**: Atharva Patil Rajput

### Step 3: Set Up Firestore User Profiles
After creating the users in Firebase Authentication, you need to create corresponding documents in Firestore:

1. Go to "Firestore Database" in Firebase Console
2. Create a collection called "users"
3. For each user, create a document with the user's UID as the document ID
4. Add the following fields to each user document:

```javascript
{
  "uid": "<USER_UID>",
  "email": "<USER_EMAIL>",
  "firstName": "<FIRST_NAME>",
  "lastName": "<LAST_NAME>",
  "phone": "+1234567890",
  "addresses": [],
  "favoriteItems": [],
  "orderHistory": [],
  "preferences": {
    "spicyLevel": "medium",
    "favoriteCuts": [],
    "specialInstructions": "",
    "notifications": {
      "email": true,
      "sms": true,
      "promotions": true
    }
  },
  "loyaltyPoints": 150,
  "totalOrders": 0,
  "totalSpent": 0,
  "isEmailVerified": true,
  "isAdmin": false,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "lastLogin": "2023-01-01T00:00:00.000Z",
  "lastOrderDate": null
}
```

## Method 2: Using Firebase CLI (For Developers)

### Prerequisites
- Install Firebase CLI: `npm install -g firebase-tools`
- Login to Firebase: `firebase login`
- Navigate to your project directory

### Step 1: Set up Firebase Emulators
```bash
# Install emulator suite
npm install -g firebase-tools

# Start emulators
firebase emulators:start --only auth,firestore
```

### Step 2: Use the Demo Setup Script
The project includes a demo setup script at `src/utils/demoSetup.js` that can be used in a Node.js environment with Firebase Admin SDK.

## Method 3: Development Environment Setup

### Step 1: Create Environment Variables
Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 2: Running the Application
```bash
npm install
npm run dev
```

## Demo Credentials

Use the following credentials to log in to the application:

### Krishna Patil Rajput
- **Email**: krishna.patil@example.com
- **Password**: DemoPass123!

### Atharva Patil Rajput
- **Email**: atharva.patil@example.com
- **Password**: DemoPass123!

## Important Notes

1. The passwords are strong passwords that meet common security requirements (uppercase, lowercase, number, special character)
2. These demo accounts are meant for development and testing purposes
3. For production, use proper authentication and security practices
4. Make sure to clean up test data regularly if using the Firebase Emulator Suite

## Troubleshooting

- If login fails, ensure the user is created in Firebase Authentication
- If user profile is not loading, verify the Firestore document exists in the "users" collection
- Check browser console for any authentication-related errors
- Ensure your Firebase project has Authentication and Firestore enabled