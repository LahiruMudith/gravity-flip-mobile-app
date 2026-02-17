// services/scoreService.ts
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Update this path to your actual config

export interface LeaderboardUser {
    id: string;
    displayName: string;
    highScore: number;
    photoURL: string;
}

export const getTop10Players = async (): Promise<LeaderboardUser[]> => {
    try {
        // Query the 'users' collection, order by score (highest first), and grab top 10
        const leaderboardQuery = query(
            collection(db, "users"),
            orderBy("highScore", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(leaderboardQuery);

        const topPlayers: LeaderboardUser[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            topPlayers.push({
                id: doc.id,
                displayName: data.displayName || "Unknown Pilot",
                highScore: data.highScore || 0,
                // Fallback to a default image if they don't have a profile pic
                photoURL: data.photoURL || "https://ui-avatars.com/api/?name=Player&background=random",
            });
        });

        return topPlayers;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};