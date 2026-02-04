import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
    AuthError, updateProfile, User
} from 'firebase/auth';
import {auth, db} from './firebase';
import {doc, setDoc} from "@firebase/firestore"; // Adjust this path if your config is elsewhere

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
        await signOut(auth);
    } catch (error) {
        throw error as AuthError;
    }
};