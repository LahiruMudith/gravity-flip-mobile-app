import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomePage() {
    const router = useRouter();

    return (
        // 'flex-1' fills screen, 'bg-black' for that dark game theme
        <View className="flex-1 bg-black items-center justify-center">
            <StatusBar style="light" />

            {/* Title with Neon Green text and shadow effect */}
            <Text className="text-5xl font-bold text-green-400 mb-12 tracking-widest shadow-lg shadow-green-500/50">
                GRAVITY FLIP
            </Text>

            <View className="w-4/5 space-y-4">
                {/* Play Button */}
                <TouchableOpacity
                    className="bg-green-400 py-4 rounded-xl items-center active:bg-green-500"
                    onPress={() => router.push('/game')}
                >
                    <Text className="text-black text-lg font-extrabold">START GAME</Text>
                </TouchableOpacity>

                {/* Leaderboard Button */}
                {/*<TouchableOpacity*/}
                {/*    className="bg-zinc-800 py-4 rounded-xl items-center active:bg-zinc-700"*/}
                {/*    onPress={() => router.push('/leaderboard')}*/}
                {/*>*/}
                {/*    <Text className="text-white text-lg font-bold">LEADERBOARD</Text>*/}
                {/*</TouchableOpacity>*/}

                {/* Profile Button - uses 'bg-zinc-800' for a secondary look */}
                <TouchableOpacity
                    className="bg-zinc-800 py-4 rounded-xl items-center active:bg-zinc-700"
                    onPress={() => router.push('/profile')}
                >
                    <Text className="text-white text-lg font-bold">PROFILE</Text>
                </TouchableOpacity>
            </View>

            {/* Footer referencing your brand */}
            <Text className="absolute bottom-10 text-zinc-500 text-xs uppercase tracking-tighter">
                Developed by Lahiru Mudith
            </Text>
        </View>
    );
}