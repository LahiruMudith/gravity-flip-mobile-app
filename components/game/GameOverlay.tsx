import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface GameOverlayProps {
    gameState: "start" | "playing" | "game-over";
    score: number;
    onStart: () => void;
    onRestart: () => void;
}

const GameOverlay = ({ gameState, score, onStart, onRestart }: GameOverlayProps) => {
    if (gameState === "playing") return null; // Hide when playing

    return (
        <View className="absolute inset-0 justify-center items-center bg-black/80 z-50">
            {/* Title */}
            <Text className="text-5xl font-extrabold text-transparent bg-clip-text text-cyan-400 mb-2 uppercase tracking-widest shadow-lg shadow-cyan-500/50">
                Gravity Flip
            </Text>

            {/* Score Display (Only on Game Over) */}
            {gameState === "game-over" && (
                <View className="mb-8 items-center">
                    <Text className="text-white text-xl font-bold">FINAL SCORE</Text>
                    <Text className="text-6xl text-yellow-400 font-black tracking-tighter shadow-md shadow-yellow-500/50">
                        {score}
                    </Text>
                </View>
            )}

            {/* The Button */}
            <TouchableOpacity
                onPress={gameState === "start" ? onStart : onRestart}
                className="bg-cyan-500 px-10 py-4 rounded-full shadow-lg shadow-cyan-500/50 active:scale-95 transition-transform"
            >
                <Text className="text-black font-bold text-2xl uppercase">
                    {gameState === "start" ? "Start Game" : "Try Again"}
                </Text>
            </TouchableOpacity>

            {/* Footer / Instructions */}
            <Text className="text-gray-400 mt-6 text-sm">Tap to Flip Gravity</Text>
        </View>
    );
};

export default GameOverlay;