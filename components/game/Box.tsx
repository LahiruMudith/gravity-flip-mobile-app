import React from "react";
import { View } from "react-native";
import { Body } from "matter-js";

interface BoxProps {
    body: Body;
    size: [number, number];
    color: string;
}

// FIX: Explicitly set the return type to ": React.JSX.Element"
const Box = ({ body, size, color }: BoxProps): React.JSX.Element => {
    const width = size[0];
    const height = size[1];

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
                borderWidth: 1,
                borderColor: "#333",
            }}
        />
    );
};

export default Box;