import React from 'react';
import { View, Text } from 'react-native';

interface ScoreProps {
    value: number;
}

const Score = ({ value }: ScoreProps) => {
    return (
        <View className="absolute top-12 w-full items-center z-10">
            <Text className="text-6xl font-black text-white/20 tracking-tighter">
                {value}
            </Text>
        </View>
    );
};

export default Score;