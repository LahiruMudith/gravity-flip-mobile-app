import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';

// Make sure this path exactly matches where your service file is located!
import { getTop10Players, LeaderboardUser } from '@/services/lederBoard';

export default function Leaderboard() {
    const [players, setPlayers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const topPlayers = await getTop10Players();
            setPlayers(topPlayers);
            setLoading(false);
        };

        fetchLeaderboard();
    }, []);

    // A helper function to give gold, silver, and bronze colors to the top 3!
    const getRankColor = (index: number) => {
        if (index === 0) return "text-yellow-400"; // Gold
        if (index === 1) return "text-gray-300";   // Silver
        if (index === 2) return "text-orange-400"; // Bronze
        return "text-zinc-400";                    // Everyone else
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-transparent">
                <ActivityIndicator size="large" color="#4ade80" />
            </View>
        );
    }

    return (
        <View className="w-full max-w-md bg-zinc-900 rounded-2xl p-4 border border-zinc-700 shadow-lg">
            <Text className="text-2xl font-bold text-center text-green-400 mb-4 tracking-widest">
                TOP 10 PILOTS
            </Text>

            <FlatList
                data={players}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View className="flex-row items-center justify-between bg-zinc-800 p-3 mb-2 rounded-xl border border-zinc-700">

                        {/* Rank & Profile Pic */}
                        <View className="flex-row items-center">
                            <Text className={`text-lg font-bold w-8 ${getRankColor(index)}`}>
                                #{index + 1}
                            </Text>

                            <Image
                                source={{ uri: item.photoURL }}
                                className="w-10 h-10 rounded-full bg-zinc-700 border border-zinc-600 ml-2"
                            />

                            <Text className="text-white font-semibold text-base ml-3 truncate w-32">
                                {item.displayName}
                            </Text>
                        </View>

                        {/* Score */}
                        <View className="bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-700">
                            <Text className="text-green-400 font-bold text-lg">
                                {item.highScore}
                            </Text>
                        </View>

                    </View>
                )}
            />
        </View>
    );
}