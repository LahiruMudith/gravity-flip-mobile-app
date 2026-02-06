import Matter from "matter-js";
import { Dimensions } from "react-native";
import Obstacle from "./Obstacle"; // Import the component

const { width, height } = Dimensions.get("window");

const ObstacleSystem = (entities: any, { time, dispatch }: any) => {
    const engine = entities.physics.engine;

    // 1. Move Obstacles & Cleanup
    Object.keys(entities).forEach((key) => {
        if (key.startsWith("Obstacle")) {
            const body = entities[key].body;

            // Move Left
            Matter.Body.setPosition(body, {
                x: body.position.x - 4, // Speed (increase to make harder)
                y: body.position.y,
            });

            // Delete if off-screen
            if (body.position.x < -100) {
                Matter.World.remove(engine.world, body);
                delete entities[key];
            }
        }
    });

    // 2. Spawn New Obstacles
    // We use a counter to time the spawns.
    // If 'tick' doesn't exist, start at 0.
    if (!entities.tick) entities.tick = 0;
    entities.tick += 1;

    // Every 90 frames (approx 1.5 seconds), spawn a pair
    if (entities.tick % 90 === 0) {
        const pipeIndex = entities.tick;

        // Create random height for the gap
        // Simple version: Just spawn a block on the floor or ceiling randomly
        const isTop = Math.random() < 0.5;
        const yPos = isTop ? height / 4 : height - height / 4;

        const obstacleBody = Matter.Bodies.rectangle(
            width + 100, // Spawn off-screen to the right
            yPos,
            50,
            200, // Tall block
            {
                isStatic: true,  // Static so they don't fall, they just move via code
                label: "Obstacle"
            }
        );

        Matter.World.add(engine.world, obstacleBody);

        // Add to entities
        entities[`Obstacle_${pipeIndex}`] = {
            body: obstacleBody,
            size: [50, 200],
            color: isTop ? "#00FF00" : "#FF00FF", // Different colors
            renderer: Obstacle,
        };
    }

    return entities;
};

export default ObstacleSystem;