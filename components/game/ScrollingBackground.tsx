import React from "react";
import { View, Image, Dimensions } from "react-native";
import { Body } from "matter-js";

const { width, height } = Dimensions.get("window");

interface BackgroundProps {
    body: Body; // We use the body to track position
    imgSource: any;
}

const ScrollingBackground = ({ body, imgSource }: BackgroundProps) => {
    const x = body.position.x;

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: x, // Controlled by Physics
                width: width * 2, // Double width for seamless looping
                height: height,
                flexDirection: "row",
                zIndex: -1, // Ensure it sits BEHIND everything
            }}
        >
            {/* Image 1 */}
            <Image
                source={imgSource}
                style={{ width: width, height: height, resizeMode: "cover", opacity: 0.5 }}
            />
            {/* Image 2 (The Clone) */}
            <Image
                source={imgSource}
                style={{ width: width, height: height, resizeMode: "cover", opacity: 0.5 }}
            />
        </View>
    );
};

export default ScrollingBackground;