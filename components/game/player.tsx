import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

export function Player({ isFlipped }: { isFlipped: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const velocity = useRef(0);

    useFrame(() => {
        // 1. Gravity Logic
        const gravity = isFlipped ? 0.08 : -0.08;
        velocity.current += gravity;
        meshRef.current.position.y += velocity.current;

        // 2. Bound Detection
        if (meshRef.current.position.y > 4) {
            meshRef.current.position.y = 4;
            velocity.current = 0;
        } else if (meshRef.current.position.y < -4) {
            meshRef.current.position.y = -4;
            velocity.current = 0;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} color="#00ffff" />
        </mesh>
    );
}