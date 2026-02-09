import React from 'react';
import { View, Text } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

// Custom "Cyberpunk" Toast Configuration
export const toastConfig = {

    // 1. SUCCESS TOAST (Neon Green)
    success: (props: any) => (
        <View className="flex-row items-center w-[90%] bg-zinc-900 border-l-4 border-green-400 rounded-xl p-4 shadow-lg shadow-green-900/50">
            <View className="mr-4 bg-green-900/30 p-2 rounded-full">
                <Ionicons name="checkmark" size={20} color="#4ade80" />
            </View>
            <View>
                <Text className="text-white font-bold text-base">{props.text1}</Text>
                <Text className="text-zinc-400 text-xs">{props.text2}</Text>
            </View>
        </View>
    ),

    // 2. ERROR TOAST (Neon Red)
    error: (props: any) => (
        <View className="flex-row items-center w-[90%] bg-zinc-900 border-l-4 border-red-500 rounded-xl p-4 shadow-lg shadow-red-900/50">
            <View className="mr-4 bg-red-900/30 p-2 rounded-full">
                <Ionicons name="alert" size={20} color="#ef4444" />
            </View>
            <View>
                <Text className="text-white font-bold text-base">{props.text1}</Text>
                <Text className="text-zinc-400 text-xs">{props.text2}</Text>
            </View>
        </View>
    ),

    // 3. INFO TOAST (Neon Blue)
    info: (props: any) => (
        <View className="flex-row items-center w-[90%] bg-zinc-900 border-l-4 border-cyan-400 rounded-xl p-4 shadow-lg shadow-cyan-900/50">
            <View className="mr-4 bg-cyan-900/30 p-2 rounded-full">
                <Ionicons name="information" size={20} color="#22d3ee" />
            </View>
            <View>
                <Text className="text-white font-bold text-base">{props.text1}</Text>
                <Text className="text-zinc-400 text-xs">{props.text2}</Text>
            </View>
        </View>
    )
};