import { Canvas } from '@react-three/fiber/native';
import { Player } from '@/components/player';
import { ScrollingTunnel } from '@/components/ScrollingTunnel';
import { Obstacle } from '@/components/Obstacle';
import { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function GravityFlip3D() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    // We use refs for collision to avoid React re-render lag
    const playerY = useRef(0);
    const obstaclePositions = useRef([
        { id: 1, z: -30, y: 4 },
        { id: 2, z: -60, y: -4 },
        { id: 3, z: -90, y: 4 }
    ]);

    const handleCollision = () => {
        setIsGameOver(true);
        // Here you could play a "Crash" sound or vibrate the phone
    };

    const resetGame = () => {
        setIsGameOver(false);
        setScore(0);
        setIsFlipped(false);
    };

    return (
        <View className="flex-1 bg-black">
            {/* HUD Overlay */}
            <View className="absolute top-12 left-0 right-0 items-center z-10">
                <Text className="text-green-400 text-4xl font-black">{score}</Text>
            </View>

            {/* Game Over Screen */}
            {isGameOver && (
                <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
                    <Text className="text-red-500 text-5xl font-black mb-4">CRASHED</Text>
                    <TouchableOpacity
                        onPress={resetGame}
                        className="bg-green-400 px-10 py-4 rounded-xl"
                    >
                        <Text className="text-black font-bold text-lg">RETRY</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                activeOpacity={1}
                onPress={() => !isGameOver && setIsFlipped(!isFlipped)}
                className="flex-1"
            >
                <Canvas camera={{ position: [0, 0, 15], fov: 50 }} // Pull back on Z to see the side view
                        gl={{ antialias: false, pixelRatio: 1 }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color="#00FF00" intensity={2} />

                    <Player
                        isFlipped={isFlipped}
                        onUpdateY={(y:any) => (playerY.current = y)}
                    />

                    {!isGameOver && (
                        <>
                            <Obstacle
                                startPos={[0, 4, -40]}
                                playerY={playerY}
                                isGameOver={isGameOver}
                                onCollide={handleCollision}
                                onPass={() => setScore(s => s + 1)}
                            />
                            <Obstacle
                                startPos={[0, 4, -40]}
                                playerY={playerY}
                                isGameOver={isGameOver}
                                onCollide={handleCollision}
                                onPass={() => setScore(s => s + 1)}
                            />
                        </>
                    )}
                    <ScrollingTunnel />
                </Canvas>
            </TouchableOpacity>
        </View>
    );
}