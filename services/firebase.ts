import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth"; // <--- Simplified import
import { getFirestore, Firestore } from "firebase/firestore";

// 1. Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCauCozRDYv9jSFOMmgIo_ciqJlsah7Ho8",
    authDomain: "gravity-flip-2d-game.firebaseapp.com",
    projectId: "gravity-flip-2d-game",
    storageBucket: "gravity-flip-2d-game.firebasestorage.app",
    messagingSenderId: "103850846573",
    appId: "1:103850846573:web:ee0a7b5fe8b5caf723d264",
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize Auth
// getAuth() automatically handles basic persistence in Expo
const auth: Auth = getAuth(app);

// 4. Initialize Firestore
const db: Firestore = getFirestore(app);

export { auth, db };