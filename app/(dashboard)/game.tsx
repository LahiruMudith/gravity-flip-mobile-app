import React, { useRef, useState } from 'react';
import {View, StatusBar, Dimensions} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

// Components
import Box from '../../components/game/Box';
import Score from '../../components/game/Score';
import Physics from '../../components/game/Physics';
import ObstacleSystem from '../../components/game/ObstacleSystem';
import CollisionSystem from '../../components/game/CollisionSystem';
import GameOverlay from '../../components/game/GameOverlay';

const { width, height } = Dimensions.get("window");

export default function GameScreen() {
    // State: "start" | "playing" | "game-over"
    const [gameState, setGameState] = useState<"start" | "playing" | "game-over">("start");
    const [score, setScore] = useState(0); // Local state to display on Game Over screen
    const gameEngineRef = useRef<any>(null);

    const setupWorld = () => {
        const engine = Matter.Engine.create({ enableSleeping: false });
        const world = engine.world;

        // Entities
        const playerBody = Matter.Bodies.rectangle(100, height / 2, 50, 50, { frictionAir: 0.05, label: "Player" });
        const floorBody = Matter.Bodies.rectangle(width / 2, height - 25, width, 50, { isStatic: true, label: "Floor" });
        const ceilingBody = Matter.Bodies.rectangle(width / 2, 25, width, 50, { isStatic: true, label: "Ceiling" });

        Matter.World.add(world, [playerBody, floorBody, ceilingBody]);

        return {
            physics: { engine: engine, world: world },
            player: { body: playerBody, size: [50, 50], color: '#06b6d4', renderer: Box }, // Cyan Player
            floor: { body: floorBody, size: [width, 50], color: '#333', renderer: Box },
            ceiling: { body: ceilingBody, size: [width, 50], color: '#333', renderer: Box },
            score: { value: 0, renderer: Score }
        };
    };

    const handleEvent = (e: any) => {
        if (e.type === "game-over") {
            setGameState("game-over");
            gameEngineRef.current.stop(); // Stop the loop
            setScore(e.score); // Save the score to state
            // OPTIONAL: Capture the final score from the event if you pass it
            // For now, the visual score resets, but you can sync this if needed.
        }
    };

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        gameEngineRef.current?.swap(setupWorld());
        gameEngineRef.current?.start();
    };

    return (
        <View className="flex-1 bg-gray-900">
            <StatusBar hidden />

            {/* The Game Loop */}
            <GameEngine
                ref={gameEngineRef}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                systems={[Physics, ObstacleSystem, CollisionSystem]}
                entities={setupWorld()}
                running={gameState === "playing"}
                onEvent={handleEvent}
            />

            {/* The UI Overlay (Handles Start & Game Over) */}
            <GameOverlay
                gameState={gameState}
                score={score}
                onStart={startGame}
                onRestart={startGame}
            />
        </View>
    );
}