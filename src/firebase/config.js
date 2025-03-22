import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Debug: Log all environment variables
console.log('Raw Environment Variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
});

// Clean and validate environment variables
const cleanEnvVar = (value) => {
  if (!value) return '';
  // Remove any quotes, spaces, or newlines
  return value.toString().trim().replace(/['"]/g, '');
};

const firebaseConfig = {
  apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID)
};

// Debug: Log cleaned config
console.log('Cleaned Firebase Config:', firebaseConfig);

// Validate API key format
const isValidApiKey = (apiKey) => {
  return apiKey && apiKey.startsWith('AIza') && apiKey.length > 30;
};

if (!isValidApiKey(firebaseConfig.apiKey)) {
  console.error('Invalid Firebase API key format. API key should start with "AIza" and be longer than 30 characters.');
  throw new Error('Invalid Firebase API key format');
}

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Log more details about the error
  if (error.code === 'auth/invalid-api-key') {
    console.error('The provided API key is invalid. Please check your .env file.');
  }
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
