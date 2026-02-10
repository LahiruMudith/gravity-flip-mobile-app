import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import Box from './Box'; // Your existing Box component

const { width, height } = Dimensions.get('window');

// --- CONFIGURATION ---
const PIPE_WIDTH = 50;

// Dynamic Speed Config
const BASE_SPEED = 5;
const SPEED_MULTIPLIER = 0.05; // Adds speed for every point scored
const MAX_SPEED = 2;          // Cap max speed

// Distance Config (Replaces Refresh Rate)
const MIN_GAP = 250; // Minimum distance between obstacles
const MAX_GAP = 450; // Maximum distance (increases variety)

export default (entities: any, { time, dispatch }: any) => {
    const engine = entities.physics.engine;

    // 1. Calculate Dynamic Speed
    // Based on current score
    const currentScore = entities.score ? entities.score.value : 0;
    let currentSpeed = BASE_SPEED + (currentScore * SPEED_MULTIPLIER);
    if (currentSpeed > MAX_SPEED) currentSpeed = MAX_SPEED;

    // 2. Move Obstacles & Cleanup
    let lastObstacleX = -1; // Track the right-most obstacle position

    Object.keys(entities).forEach(key => {
        if (key.startsWith("Obstacle")) {
            const body = entities[key].body;

            // Move Left
            Matter.Body.translate(body, { x: -currentSpeed, y: 0 });

            // Update lastObstacleX to find the furthest one to the right
            if (body.position.x > lastObstacleX) {
                lastObstacleX = body.position.x;
            }

            // Cleanup if off-screen
            if (body.position.x < -100) {
                Matter.World.remove(engine.world, body);
                delete entities[key];

                // SCORE UPDATE LOGIC
                // Prevent double scoring for Pattern 0 (Top & Bottom pipes)
                // We only score if the pipe is NOT the bottom one.
                if (!key.includes("Bottom")) {
                    entities.score.value += 1;
                    dispatch({ type: "score", score: entities.score.value });
                }
            }
        }
    });

    // 3. Spawn New Obstacles (Distance Based)
    // We check if the last obstacle has moved far enough to the left

    // Initialize nextGap if it doesn't exist yet
    if (!entities.nextGap) entities.nextGap = MIN_GAP;

    // Logic: If no obstacles exist OR the gap has been met
    if (lastObstacleX === -1 || (width - lastObstacleX) > entities.nextGap) {

        // Set the gap for the *next* spawn randomly
        entities.nextGap = Math.floor(Math.random() * (MAX_GAP - MIN_GAP + 1)) + MIN_GAP;

        // --- PATTERN GENERATION (Your Logic) ---
        const pattern = Math.floor(Math.random() * 3);
        const id = Date.now(); // Unique ID

        const spawnX = width + 50; // Spawn just off-screen

        if (pattern === 0) {
            // PATTERN 1: TOP & BOTTOM GAP
            const gapSize = 200;
            const gapPosition = Math.random() * (height - gapSize - 100) + 50;

            const topHeight = gapPosition;
            const bottomHeight = height - gapSize - gapPosition;

            // Note: MatterJS positions are based on the center of the body
            const topBody = Matter.Bodies.rectangle(spawnX, topHeight / 2, PIPE_WIDTH, topHeight, { isStatic: true, label: "Obstacle" });
            const bottomBody = Matter.Bodies.rectangle(spawnX, height - (bottomHeight / 2), PIPE_WIDTH, bottomHeight, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, [topBody, bottomBody]);

            entities[`ObstacleTop_${id}`] = { body: topBody, size: [PIPE_WIDTH, topHeight], color: '#ef4444', renderer: Box };
            entities[`ObstacleBottom_${id}`] = { body: bottomBody, size: [PIPE_WIDTH, bottomHeight], color: '#ef4444', renderer: Box };
        }

        else if (pattern === 1) {
            // PATTERN 2: CENTER FLOATING BLOCK
            const blockSize = Math.random() * 100 + 80;
            const randomY = Math.random() * (height - 300) + 150;

            const centerBody = Matter.Bodies.rectangle(spawnX, randomY, PIPE_WIDTH, blockSize, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, centerBody);
            entities[`ObstacleCenter_${id}`] = { body: centerBody, size: [PIPE_WIDTH, blockSize], color: '#fbbf24', renderer: Box };
        }

        else {
            // PATTERN 3: SINGLE EDGE (Top or Bottom)
            const isTop = Math.random() > 0.5;
            const blockSize = Math.random() * 150 + 100;
            const yPos = isTop ? blockSize / 2 : height - (blockSize / 2);

            const body = Matter.Bodies.rectangle(spawnX, yPos, PIPE_WIDTH, blockSize, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, body);
            entities[`ObstacleSingle_${id}`] = { body: body, size: [PIPE_WIDTH, blockSize], color: '#a855f7', renderer: Box };
        }
    }

    return entities;
};