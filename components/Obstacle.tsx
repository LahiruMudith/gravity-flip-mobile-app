import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

interface ObstacleProps {
    startPos: [number, number, number];
    playerY: React.MutableRefObject<number>; // To track player position
    isGameOver: boolean;
    onCollide: () => void;
    onPass: () => void;
}

export function Obstacle({ startPos, playerY, isGameOver, onCollide, onPass }: ObstacleProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const SPEED = 0.6;

    // components/SideObstacle.tsx
    useFrame(() => {
        if (isGameOver) return;

        // Move from Right to Left
        meshRef.current.position.x -= SPEED;

        // Collision Logic (Player is at X = -5)
        const isNearPlayerX = meshRef.current.position.x > -6 && meshRef.current.position.x < -4;
        const isSameY = Math.abs(meshRef.current.position.y - playerY.current) < 1.8;

        if (isNearPlayerX && isSameY) {
            onCollide();
        }

        // Reset obstacle
        if (meshRef.current.position.x < -20) {
            meshRef.current.position.x = 40; // Spawn far right
            meshRef.current.position.y = Math.random() > 0.5 ? 4 : -4;
            onPass();
        }
    });

    return (
        <mesh ref={meshRef} position={startPos}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
                emissive="#FF0000"
                emissiveIntensity={2}
                color="#FF0000"
            />
        </mesh>
    );
}