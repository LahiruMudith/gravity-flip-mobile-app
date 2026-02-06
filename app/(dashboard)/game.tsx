// app/(dashboard)/game.tsx
import React, { useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, StatusBar } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { Alert } from 'react-native'; // Import Alert

// Import your components
import Box from '../../components/game/Box';
import Physics from '../../components/game/Physics';
import ObstacleSystem from '../../components/game/ObstacleSystem';
import CollisionSystem from '../../components/game/CollisionSystem';

const { width, height } = Dimensions.get("window");

export default function GameScreen() {
    const [running, setRunning] = useState(true);
    const gameEngineRef = useRef<GameEngine>(null);


    // --- SETUP THE WORLD ---
    // We wrap this in a function so we can restart the game easily later
    const setupWorld = () => {
        const engine = Matter.Engine.create({ enableSleeping: false });
        const world = engine.world;

        // 1. Create Player (Red Box)
        const playerBody = Matter.Bodies.rectangle(100, height / 2, 50, 50, {
            frictionAir: 0.05,
            restitution: 0.8,
            label: "Player"
        });

        // 2. Create Floor (Static)
        const floorBody = Matter.Bodies.rectangle(width / 2, height - 25, width, 50, {
            isStatic: true,
            label: "Floor"
        });

        // 3. Create Ceiling (Static)
        const ceilingBody = Matter.Bodies.rectangle(width / 2, 25, width, 50, {
            isStatic: true,
            label: "Ceiling"
        });

        // Add everything to the physics world
        Matter.World.add(world, [playerBody, floorBody, ceilingBody]);

        return {
            physics: { engine: engine, world: world },

            // CHANGE THIS: Remove the < > brackets
            player: {
                body: playerBody,
                size: [50, 50],
                color: 'red',
                renderer: Box  // <--- Just pass the name "Box"
            },

            floor: {
                body: floorBody,
                size: [width, 50],
                color: 'grey',
                renderer: Box // <--- Here too
            },

            ceiling: {
                body: ceilingBody,
                size: [width, 50],
                color: 'grey',
                renderer: Box // <--- And here
            },
        };
    };

    // Handle Game Events
    const onEvent = (e: any) => {
        if (e.type === "game-over") {
            setRunning(false);
            Alert.alert("Game Over", "You hit a wall!", [
                {
                    text: "Try Again",
                    onPress: () => {
                        setRunning(true);
                        // Fix applied below:
                        gameEngineRef.current?.swap(setupWorld());
                    }
                }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <GameEngine
                ref={gameEngineRef}
                style={styles.gameContainer}
                // ADD CollisionSystem HERE:
                systems={[Physics, ObstacleSystem, CollisionSystem]}
                entities={setupWorld()}
                running={running}
                onEvent={onEvent} // <--- Listen for Game Over
            >
                <StatusBar hidden={true} />
            </GameEngine>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gameContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});