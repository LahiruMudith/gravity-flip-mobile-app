// components/game/CollisionSystem.ts
import Matter from "matter-js";

const CollisionSystem = (entities: any, { dispatch }: any) => {
    const engine = entities.physics.engine;

    // Matter.js updates this list every frame with things that are touching
    const pairs = engine.pairs.list;

    // Loop through all active collisions
    for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        // Check if one body is "Player" and the other is "Obstacle"
        if (
            (bodyA.label === "Player" && bodyB.label === "Obstacle") ||
            (bodyB.label === "Player" && bodyA.label === "Obstacle")
        ) {
            // Send a signal to the App to stop the game
            dispatch({ type: "game-over" });
        }
    }

    return entities;
};

export default CollisionSystem;