import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    GoogleAuthProvider,
    signInWithCredential,
    AuthError, updateProfile, User
} from 'firebase/auth';
import {auth, db} from './firebase';
import {doc, setDoc} from "@firebase/firestore"; // Adjust this path if your config is elsewhere
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID,
});


// 1. Register Method
export const registerUser = async (email: string, password: string, fullname:string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, { displayName: fullname })
        await setDoc(doc(db, "users", userCredential.user.uid), {
            name: fullname,
            role: "user",
            email,
            createAt: new Date()
        })
        return userCredential.user
    } catch (error) {
        // We throw the error so the UI (Screen) can catch it and show an Alert
        throw error as AuthError;
    }
};

// 2. Login Method
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw error as AuthError;
    }
};

// 3. Logout Method
export const logoutUser = async (): Promise<void> => {
    try {
        await auth.signOut(); // Logs out of Firebase
        await GoogleSignin.signOut(); // Logs out of Google
    } catch (error) {
        throw error as AuthError;
    }
};

export const loginWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            const idToken = response.data.idToken;
            if (!idToken) throw new Error("No ID token found from Google");

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);

            return userCredential.user;
        } else {
            // Throw a specific error if the user just closed the popup
            throw new Error("cancelled");
        }
    } catch (error) {
        // Pass the error back to the UI to handle Toast messages
        throw error;
    }
};