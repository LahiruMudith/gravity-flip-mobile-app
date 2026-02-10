import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface GameOverlayProps {
    gameState: "start" | "playing" | "game-over";
    score: number;
    onStart: () => void;
    onRestart: () => void;
    onHome: () => void;
}

const GameOverlay = ({ gameState, score, onStart, onRestart, onHome }: GameOverlayProps) => {

    if (gameState === "playing") return null;

    const mainAction = gameState === "start" ? onStart : onRestart;
    const mainButtonText = gameState === "start" ? "INITIALIZE" : "RETRY SYSTEM";

    return (
        // Container: Dark background with glowing side borders for a HUD feel
        <View className="absolute inset-0 justify-center items-center bg-slate-950/95 border-x-2 border-cyan-500/20 z-50 px-8">

            {/* CYBERPUNK TITLE: Gradient text for neon effect */}
            <View className="mb-12">
                <Text className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 uppercase tracking-[0.2em] italic text-center shadow-cyan-500/50">
                    GRAVITY
                </Text>
                <Text className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 uppercase tracking-[0.2em] italic text-center relative bottom-2">
                    FLIP
                </Text>
            </View>

            {/* SCORE DATA PANEL (Game Over Only) */}
            {gameState === "game-over" && (
                <View className="mb-12 items-center w-full">
                    {/* A digital container for the score */}
                    <View className="bg-black/60 border-2 border-cyan-500/50 p-6 w-full items-center rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden">
                        {/* Cosmetic corner elements */}
                        <View className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"/>
                        <View className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"/>
                        <View className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"/>
                        <View className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"/>

                        <Text className="text-cyan-300 text-sm font-bold tracking-[4px] uppercase mb-2">
                            [ FINAL SCORE DATA ]
                        </Text>
                        {/* Yellow/Gold score for contrast */}
                        <Text className="text-7xl text-yellow-300 font-black tracking-tighter shadow-xl shadow-yellow-500/40 italic">
                            {score}
                        </Text>
                    </View>
                </View>
            )}

            {/* MAIN ACTION BUTTON (Glowing Gradient) */}
            <TouchableOpacity
                onPress={mainAction}
                activeOpacity={0.8}
                // Sharper corners (rounded-sm), strong glow shadow, gradient bg, thick bottom border for depth
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-sm shadow-[0_0_35px_rgba(34,211,238,0.4)] active:scale-[0.98] transition-transform items-center mb-5 border-b-4 border-blue-900/50"
            >
                <Text className="text-white font-black text-2xl uppercase tracking-[0.2em]">
                    {mainButtonText}
                </Text>
            </TouchableOpacity>

            {/* SECONDARY HOME BUTTON (Game Over Only - Fuchsia Accent) */}
            {gameState === "game-over" && (
                <TouchableOpacity
                    onPress={onHome}
                    activeOpacity={0.8}
                    // Darker bg, border uses the secondary neon color (fuchsia/pink)
                    className="w-full bg-zinc-900/90 border-2 border-fuchsia-500/50 py-4 rounded-sm active:bg-zinc-800 items-center flex-row justify-center shadow-[0_0_15px_rgba(217,70,239,0.2)]"
                >
                    <Ionicons name="home" size={20} color="#d946ef" style={{ marginRight: 10 }} />
                    <Text className="text-fuchsia-300 font-bold text-lg uppercase tracking-wider">
                        RETURN TO Home
                    </Text>
                </TouchableOpacity>
            )}

            {/* FOOTER INSTRUCTIONS (Start Only) */}
            {gameState === "start" && (
                <View className="mt-10 bg-black/40 px-6 py-3 border-x-2 border-cyan-600/50">
                    <Text className="text-cyan-500 text-sm uppercase tracking-[0.3em] font-bold text-center">
                        Tap screen to engage gravity inverter
                    </Text>
                </View>
            )}
        </View>
    );
};

export default GameOverlay;