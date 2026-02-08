import Matter from "matter-js";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const BackgroundSystem = (entities: any, { dispatch }: any) => {
    // Loop through entities to find the background
    Object.keys(entities).forEach((key) => {
        if (key === "background") {
            const body = entities[key].body;

            // 1. Move Left (Speed should be slightly slower than obstacles for depth effect)
            Matter.Body.translate(body, { x: -2, y: 0 });

            // 2. Reset if off-screen
            // When the 'x' position moves left by one full screen width (-width),
            // we snap it back to 0.
            if (body.position.x <= -width) {
                Matter.Body.setPosition(body, { x: 0, y: body.position.y });
            }
        }
    });

    return entities;
};

export default BackgroundSystem;