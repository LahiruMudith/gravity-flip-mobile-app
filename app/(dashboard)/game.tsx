import React, { useRef, useState, useEffect } from 'react';
import { View, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import Box from '../../components/game/Box';
import Score from '../../components/game/Score';
import Physics from '../../components/game/Physics';
import ObstacleSystem from '../../components/game/ObstacleSystem';
import CollisionSystem from '../../components/game/CollisionSystem';
import GameOverlay from '../../components/game/GameOverlay';
import ScrollingBackground from '../../components/game/ScrollingBackground';
import BackgroundSystem from '../../components/game/BackgroundSystem';
import VideoBackground from '../../components/game/VideoBackground';
import Spaceship from '../../components/game/Spaceship';
import { saveGameScore } from "@/services/scoreService";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/toastConfig";

const { width, height } = Dimensions.get("screen");

export default function GameScreen() {
    const router = useRouter();
    const [gameState, setGameState] = useState<"start" | "playing" | "game-over">("playing");
    const [score, setScore] = useState(0);
    const gameEngineRef = useRef<any>(null);

    const [gameOverSound, setGameOverSound] = useState<Audio.Sound | null>(null);

    async function playGameOverSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/game_over.mp3')
            );
            setGameOverSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log("Error loading game over sound:", error);
        }
    }

    useEffect(() => {
        return gameOverSound
            ? () => {
                gameOverSound.unloadAsync();
            }
            : undefined;
    }, [gameOverSound]);

    const setupWorld = () => {
        const engine = Matter.Engine.create({ enableSleeping: false });
        const world = engine.world;

        const playerBody = Matter.Bodies.rectangle(100, height / 2, 50, 50, { frictionAir: 0.05, label: "Player" });
        const floorBody = Matter.Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true, label: "Floor" });
        const ceilingBody = Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true, label: "Ceiling" });

        const backgroundBody = Matter.Bodies.rectangle(0, 0, width, height, {
            isStatic: true,
            isSensor: true
        });

        Matter.World.add(world, [backgroundBody, playerBody, floorBody, ceilingBody]);

        return {
            physics: { engine: engine, world: world },
            background: { body: backgroundBody, renderer: VideoBackground },
            player: { body: playerBody, size: [50, 50], renderer: Spaceship },
            floor: { body: floorBody, size: [width, 50], renderer: null },
            ceiling: { body: ceilingBody, size: [width, 50], renderer: null },
            score: { value: 0, renderer: Score },
            nextGap: 300,
        };
    };

    const handleEvent = async (e: any) => {
        if (e.type === "game-over") {
            setGameState("game-over");
            gameEngineRef.current.stop();
            const finalScore = e.score;
            setScore(finalScore);

            playGameOverSound();

            saveGameScore(finalScore).then((isHighScore) => {
                if (isHighScore) {
                    Toast.show({
                        type: 'success',
                        text1: `NEW HIGH SCORE: ${finalScore}!`,
                        text2: 'You are moving up the ranks!',
                    });
                }
            });
        }
    }

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        gameEngineRef.current?.swap(setupWorld());
        gameEngineRef.current?.start();
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar hidden translucent />

            <GameEngine
                ref={gameEngineRef}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                systems={[Physics, ObstacleSystem, CollisionSystem, BackgroundSystem]}
                entities={setupWorld()}
                running={gameState === "playing"}
                onEvent={handleEvent}
            />

            <TouchableOpacity
                onPress={() => {
                    gameEngineRef.current?.stop();
                    router.push('/home');
                }}
                className="absolute top-12 left-6 z-50 bg-zinc-800/90 p-3 rounded-xl border border-zinc-700 shadow-md active:bg-zinc-700 backdrop-blur-md"
            >
                <Ionicons name="arrow-back" size={24} color="#4ade80" />
            </TouchableOpacity>

            <GameOverlay
                gameState={gameState}
                score={score}
                onStart={startGame}
                onRestart={startGame}
                onHome={() => {
                    gameEngineRef.current?.stop();
                    router.replace('/home');
                }}
            />
            <Toast config={toastConfig} />
        </View>
    );
}