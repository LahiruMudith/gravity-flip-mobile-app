// components/SideScrollingTunnel.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

export function ScrollingTunnel() {
    const grid1 = useRef<THREE.GridHelper>(null!);
    const grid2 = useRef<THREE.GridHelper>(null!);

    const SPEED = 0.4;
    const GRID_SIZE = 100;

    useFrame(() => {
        // Move left (negative X)
        grid1.current.position.x -= SPEED;
        grid2.current.position.x -= SPEED;

        // Reset when it leaves the left side of the screen
        if (grid1.current.position.x < -GRID_SIZE) {
            grid1.current.position.x = grid2.current.position.x + GRID_SIZE;
        }
        if (grid2.current.position.x < -GRID_SIZE) {
            grid2.current.position.x = grid1.current.position.x + GRID_SIZE;
        }
    });

    return (
        <>
            <gridHelper ref={grid1} args={[GRID_SIZE, 20, '#00FFFF', '#111']} position={[0, -5, 0]} />
            <gridHelper ref={grid2} args={[GRID_SIZE, 20, '#00FFFF', '#111']} position={[GRID_SIZE, -5, 0]} />
            {/* Ceiling Grid */}
            <gridHelper args={[GRID_SIZE * 2, 20, '#00FFFF', '#111']} position={[0, 5, 0]} rotation={[Math.PI, 0, 0]} />
        </>
    );
}