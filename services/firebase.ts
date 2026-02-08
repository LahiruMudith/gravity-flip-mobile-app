import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth"; // <--- Simplified import
import { getFirestore, Firestore } from "firebase/firestore";

// 1. Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize Auth
// getAuth() automatically handles basic persistence in Expo
const auth: Auth = getAuth(app);

// 4. Initialize Firestore
const db: Firestore = getFirestore(app);

export { auth, db };