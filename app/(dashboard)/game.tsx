import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "@/global.css";

const { width, height } = Dimensions.get('window');

// Game Constants
const GRAVITY_FORCE = 0.8;
const CEILING = 50;
const FLOOR = height - 100;

export default function GravityFlip() {
    const router = useRouter();

    // Game State
    const [posY, setPosY] = useState(height / 2);
    const [velocity, setVelocity] = useState(0);
    const [isUpsideDown, setIsUpsideDown] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');

    // Refs for the game loop (avoids re-render lag)
    const requestRef = useRef<number>(0);
    const posRef = useRef(height / 2);
    const velRef = useRef(0);
    const gravityRef = useRef(GRAVITY_FORCE);

    const flipGravity = () => {
        if (gameState !== 'PLAYING') return;

        // Reverse the gravity direction
        gravityRef.current = isUpsideDown ? GRAVITY_FORCE : -GRAVITY_FORCE;
        setIsUpsideDown(!isUpsideDown);
    };

    const startGame = () => {
        setScore(0);
        setGameState('PLAYING');
        posRef.current = height / 2;
        velRef.current = 0;
        gravityRef.current = GRAVITY_FORCE;
    };

    const gameLoop = () => {
        if (gameState === 'PLAYING') {
            // 1. Update Velocity based on gravity
            velRef.current += gravityRef.current;

            // 2. Update Position based on velocity
            posRef.current += velRef.current;

            // 3. Collision Detection (Ceiling & Floor)
            if (posRef.current >= FLOOR) {
                posRef.current = FLOOR;
                velRef.current = 0;
            } else if (posRef.current <= CEILING) {
                posRef.current = CEILING;
                velRef.current = 0;
            }

            // 4. Update UI
            setPosY(posRef.current);
            setScore(prev => prev + 1); // Increment score over time
        }
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [gameState]);

    return (
        <View className="flex-1 bg-black">
            <StatusBar hidden />

            {/* Scoreboard */}
            <View className="absolute top-12 w-full items-center z-10">
                <Text className="text-green-400 text-5xl font-black">{Math.floor(score / 10)}</Text>
            </View>

            {/* Main Game Area */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={gameState === 'PLAYING' ? flipGravity : startGame}
                className="flex-1"
            >
                {/* Top Boundary */}
                <View className="absolute top-0 w-full h-12 bg-zinc-900 border-b-2 border-green-900" />

                {/* Player Sprite */}
                <View
                    style={{ top: posY }}
                    className="absolute left-20 w-12 h-12 bg-green-400 rounded-md shadow-lg shadow-green-500/50 items-center justify-center"
                >
                    {/* Small eye to show direction */}
                    <View className={`w-2 h-2 bg-black rounded-full mb-1 ${isUpsideDown ? 'mt-4' : 'mt-0'}`} />
                </View>

                {/* Bottom Boundary */}
                <View className="absolute bottom-0 w-full h-24 bg-zinc-900 border-t-2 border-green-900" />

                {/* Start / Game Over Overlays */}
                {gameState !== 'PLAYING' && (
                    <View className="absolute inset-0 bg-black/70 items-center justify-center">
                        <Text className="text-white text-4xl font-bold mb-4">
                            {gameState === 'START' ? 'READY?' : 'CRASHED!'}
                        </Text>
                        <Text className="text-green-400 text-lg mb-8">
                            TAP TO {gameState === 'START' ? 'START' : 'RETRY'}
                        </Text>
                        <TouchableOpacity onPress={() => router.replace('/')}>
                            <Text className="text-zinc-500">BACK TO MENU</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}