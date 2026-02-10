import React from "react";
import { Image } from "react-native";

const Spaceship = (props: any) => {
    // 1. Get body position and dimensions
    const { body, size } = props;
    const width = size[0];
    const height = size[1];

    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    // Optional: Use body angle if your game has rotation
    // const angle = body.angle;

    return (
        <Image
            source={require('../../assets/player.png')} // <--- Make sure path is correct
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                resizeMode: 'contain', // Keeps aspect ratio nice
                // transform: [{ rotate: `${angle}rad` }] // Uncomment if you want rotation
            }}
        />
    );
};

export default Spaceship;