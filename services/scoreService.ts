import { auth, db } from '@/services/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Saves the score to the database.
 * Updates 'lastScore' always.
 * Updates 'highScore' ONLY if the new score is higher.
 * * @param score - The score achieved in the current game
 * @returns Promise<boolean> - Returns true if this was a NEW High Score
 */
export const saveGameScore = async (score: number): Promise<boolean> => {
    try {
        const user = auth.currentUser;
        if (!user) return false; // If playing as guest, don't save

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const currentHighScore = data.highScore || 0;

            const isNewHighScore = score > currentHighScore;

            // Prepare the update object
            const updates: any = {
                lastScore: score,
                gamesPlayed: increment(1) // Optional: Track total games
            };

            // Only update high score if beat
            if (isNewHighScore) {
                updates.highScore = score;
            }

            await updateDoc(userRef, updates);

            return isNewHighScore;
        }

        return false;

    } catch (error) {
        console.error("Error saving score:", error);
        return false;
    }
};