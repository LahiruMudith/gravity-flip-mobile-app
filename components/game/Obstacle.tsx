import React from "react";
import { View } from "react-native";
import { Body } from "matter-js";

interface ObstacleProps {
    body: Body;
    size: [number, number];
    color: string;
}

const Obstacle = ({ body, size, color }: ObstacleProps): React.JSX.Element => {
    const width = size[0];
    const height = size[1];

    // Update position based on Physics Body
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <View
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: color,
                // Optional: Add a glow effect
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10,
            }}
        />
    );
};

export default Obstacle;