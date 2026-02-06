import Matter from "matter-js";

// Note: Removing 'GameEngineSystem' type temporarily to avoid TS conflicts
const Physics = (entities: any, { touches, time, dispatch }: any) => {
    let engine = entities.physics.engine;

    // SAFETY CHECK: If 'touches' is missing, stop here to prevent the crash
    if (!touches) {
        return entities;
    }

    if (entities.score) {
        // 1. Initialize a "tick" counter if it doesn't exist
        if (typeof entities.score.ticks === 'undefined') entities.score.ticks = 0;

        // 2. Count the frames
        entities.score.ticks++;

        // 3. Only add 1 point every 10 frames (Adjust '10' to make it faster/slower)
        if (entities.score.ticks % 35 === 0) {
            entities.score.value += 1;
        }
    }

    // 1. Handle Taps
    // We use "find" to see if there is at least one 'press' event
    let press = touches.find((t: any) => t.type === "press");

    if (press) {
        // FLIP GRAVITY
        // Toggle between 1 (Down) and -1 (Up)
        engine.world.gravity.y = engine.world.gravity.y === 1 ? -1 : 1;

        // Optional: Add a tiny "kick" to prevent sticking to the wall
        // Matter.Body.applyForce(entities.player.body, entities.player.body.position, { x: 0, y: -0.05 * engine.world.gravity.y });
    }

    Matter.Engine.update(engine, time.delta);
    return entities;
};

export default Physics;