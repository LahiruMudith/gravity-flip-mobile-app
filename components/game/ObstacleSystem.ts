import Matter from 'matter-js';
import { Dimensions } from 'react-native';
// IMPORT THE NEW NEON RENDERER
import NeonBox from './NeonBox';

const { width, height } = Dimensions.get('screen');

// --- CONFIGURATION ---
const PIPE_WIDTH = 50;
const BASE_SPEED = 1;
const SPEED_MULTIPLIER = 0.05;
const MAX_SPEED = 8;
const MIN_GAP = 250;
const MAX_GAP = 650;

// --- SETTINGS ---
const MIN_PIPE_HEIGHT = height * 0.1;
const MAX_SINGLE_BLOCK_HEIGHT = height * 0.25;
const TOP_OFFSET = 10;
const BOTTOM_OFFSET = 15;

// --- NEON COLORS ---
// Brighter colors look better for neon
const RED_NEON = '#ff073a';    // A brighter, intense red
const YELLOW_NEON = '#ffff00'; // Pure bright yellow
const PURPLE_NEON = '#df00fe'; // Phonk/Cyberpunk purple

export default (entities: any, { time, dispatch }: any) => {
    const engine = entities.physics.engine;

    // 1. Dynamic Speed
    const currentScore = entities.score ? entities.score.value : 0;
    let currentSpeed = BASE_SPEED + (currentScore * SPEED_MULTIPLIER);
    if (currentSpeed > MAX_SPEED) currentSpeed = MAX_SPEED;

    // 2. Move & Cleanup
    let lastObstacleX = -1;

    Object.keys(entities).forEach(key => {
        if (key.startsWith("Obstacle")) {
            const body = entities[key].body;
            Matter.Body.translate(body, { x: -currentSpeed, y: 0 });

            if (body.position.x > lastObstacleX) lastObstacleX = body.position.x;

            if (body.position.x < -100) {
                Matter.World.remove(engine.world, body);
                delete entities[key];

                if (!key.includes("Bottom")) {
                    entities.score.value += 1;
                    dispatch({ type: "score", score: entities.score.value });
                }
            }
        }
    });

    // 3. Spawn New Obstacles
    if (!entities.nextGap) entities.nextGap = MIN_GAP;

    if (lastObstacleX === -1 || (width - lastObstacleX) > entities.nextGap) {

        entities.nextGap = Math.floor(Math.random() * (MAX_GAP - MIN_GAP + 1)) + MIN_GAP;

        const pattern = Math.floor(Math.random() * 3);
        const id = Date.now();
        const spawnX = width + 50;

        if (pattern === 0) {
            // PATTERN 1: TOP & BOTTOM GAP
            const gapSize = 200;

            const minGapY = MIN_PIPE_HEIGHT + TOP_OFFSET;
            const maxGapY = height - gapSize - MIN_PIPE_HEIGHT;

            const gapPosition = Math.random() * (maxGapY - minGapY) + minGapY;

            const topHeight = gapPosition;
            const bottomHeight = height - gapSize - gapPosition - BOTTOM_OFFSET;

            const topBody = Matter.Bodies.rectangle(
                spawnX,
                TOP_OFFSET + (topHeight / 2),
                PIPE_WIDTH,
                BOTTOM_OFFSET + (topHeight / 2),
                { isStatic: true, label: "Obstacle" }
            );

            const bottomBody = Matter.Bodies.rectangle(spawnX, height - (bottomHeight / 2), PIPE_WIDTH, bottomHeight, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, [topBody, bottomBody]);

            // >>> UPDATE RENDERER AND COLORS HERE <<<
            entities[`ObstacleTop_${id}`] = { body: topBody, size: [PIPE_WIDTH, topHeight], color: RED_NEON, renderer: NeonBox };
            entities[`ObstacleBottom_${id}`] = { body: bottomBody, size: [PIPE_WIDTH, bottomHeight], color: RED_NEON, renderer: NeonBox };
        }

        else if (pattern === 1) {
            // PATTERN 2: CENTER FLOATING
            const blockSize = Math.random() * (MAX_SINGLE_BLOCK_HEIGHT - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
            const randomY = Math.random() * (height - 300) + (150);

            const centerBody = Matter.Bodies.rectangle(spawnX, randomY, PIPE_WIDTH, blockSize, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, centerBody);
            // >>> UPDATE RENDERER AND COLORS HERE <<<
            entities[`ObstacleCenter_${id}`] = { body: centerBody, size: [PIPE_WIDTH, blockSize], color: YELLOW_NEON, renderer: NeonBox };
        }

        else {
            // PATTERN 3: SINGLE EDGE
            const isTop = Math.random() > 0.5;
            const blockSize = Math.random() * (MAX_SINGLE_BLOCK_HEIGHT - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;

            let yPos = 0;
            if (isTop) {
                yPos = (blockSize / 2);
            } else {
                yPos = height - (blockSize / 2);
            }

            const body = Matter.Bodies.rectangle(spawnX, yPos, PIPE_WIDTH, blockSize, { isStatic: true, label: "Obstacle" });

            Matter.World.add(engine.world, body);
            // >>> UPDATE RENDERER AND COLORS HERE <<<
            entities[`ObstacleSingle_${id}`] = { body: body, size: [PIPE_WIDTH, blockSize], color: PURPLE_NEON, renderer: NeonBox };
        }
    }

    return entities;
};