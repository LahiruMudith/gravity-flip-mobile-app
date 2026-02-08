import {
    updateProfile,
    updateEmail,
    updatePassword,
    AuthError,
    User
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Adjust path to match your project structure

// 1. Update Display Name
export const updateUserName = async (fullname: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is currently logged in.");

        // A. Update Auth Profile (The user object)
        await updateProfile(user, { displayName: fullname });

        // B. Sync with Firestore (The database)
        // We use 'updateDoc' so we don't overwrite existing fields like 'role' or 'createdAt'
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            name: fullname
        });

    } catch (error) {
        throw error as AuthError;
    }
};

// 2. Update Email Address
export const updateUserEmail = async (newEmail: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is currently logged in.");

        // A. Update Auth Email
        await updateEmail(user, newEmail);

        // B. Sync with Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            email: newEmail
        });

    } catch (error) {
        // NOTE: If the user hasn't signed in recently, Firebase will throw 
        // an error code: 'auth/requires-recent-login'.
        throw error as AuthError;
    }
};

// 3. Update Password
export const updateUserPassword = async (newPassword: string): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is currently logged in.");

        // Update Auth Password
        await updatePassword(user, newPassword);

    } catch (error) {
        // NOTE: Like email, this requires a recent login.
        throw error as AuthError;
    }
};