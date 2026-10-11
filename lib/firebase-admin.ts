import * as admin from 'firebase-admin';

let isInitialized = false;

function initializeAdmin() {
  if (isInitialized || admin.apps.length) {
    isInitialized = true;
    return;
  }

  try {
    const serviceAccountString = process.env.FIREBASE_ADMIN_KEY;
    if (!serviceAccountString) {
      console.warn("FIREBASE_ADMIN_KEY is not set. Database operations will fail.");
      return;
    }
    
    // Check if it's already a JSON string or need to be parsed
    const serviceAccount = serviceAccountString.trim().startsWith('{') 
      ? JSON.parse(serviceAccountString)
      : null;

    if (!serviceAccount) {
      console.warn("FIREBASE_ADMIN_KEY is not valid JSON.");
      return;
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    isInitialized = true;
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Proactive initialization
initializeAdmin();

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminStorage = admin.apps.length ? admin.storage() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
export { admin as firebaseAdmin };
