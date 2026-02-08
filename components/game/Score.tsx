import React from 'react';
import { View, Text } from 'react-native';

interface ScoreProps {
    value: number;
}

const Score = ({ value }: ScoreProps) => {
    return (
        <View className="absolute top-12 right-6 items-end z-10 pointer-events-none">

            {/* Container: Matches Home Page 'bg-black' theme but semi-transparent */}
            <View className="flex-row items-center bg-zinc-900/90 px-5 py-2 rounded-xl border border-green-400/30 shadow-lg shadow-green-500/20 backdrop-blur-md">

                {/* Label: Neon Green like your Title */}
                <Text className="text-green-400 font-extrabold text-[10px] tracking-widest mr-3 opacity-90">
                    SCORE
                </Text>

                {/* Separator */}
                <View className="h-5 w-[1px] bg-green-400/30 mr-3" />

                {/* Number: White & Extrabold to match button text */}
                <Text className="text-white font-extrabold text-2xl tracking-tighter">
                    {value.toString().padStart(4, '0')}
                </Text>

            </View>
        </View>
    );
};

export default Score;