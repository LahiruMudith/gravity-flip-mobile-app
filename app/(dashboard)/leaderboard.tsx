import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// This imports your perfect UI code from step 1!
// (Double check this path matches your folder structure)
import Leaderboard from '../../components/game/Leaderboard';


export default function LeaderboardScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 p-6 mt-8">

                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-6 bg-zinc-800 self-start p-3 rounded-xl border border-zinc-700 active:bg-zinc-700"
                >
                    <Ionicons name="arrow-back" size={24} color="#4ade80" />
                </TouchableOpacity>

                {/* The Top 10 List */}
                <View className="flex-1 items-center w-full">
                    <Leaderboard />
                </View>

            </View>
        </SafeAreaView>
    );
}