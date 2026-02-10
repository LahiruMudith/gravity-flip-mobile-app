import React from "react";
import { View } from "react-native";
import { Shadow } from 'react-native-shadow-2';

const NeonBox = (props: any) => {
    const { body, size, color } = props;
    const width = size[0];
    const height = size[1];

    // MatterJS calculates position from center, we need top-left for rendering
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    // Configuration for the Neon effect
    const glowDistance = 15; // How far the light spreads
    // We add transparency to the shadow color so it looks like light, not solid paint
    const glowColor = `${color}99`; // Hex color + 99 for ~60% opacity

    return (
        <View style={{
            position: "absolute",
            left: x,
            top: y,
            // We need to center the shadow container
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            height: height,
        }}>
            <Shadow
                startColor={glowColor}
                finalColor={'#00000000'} // Fade to transparent
                distance={glowDistance}
                offset={[0, 0]} // Center the glow
                paintInside={false} // Don't glow inside the box
            >
                {/* The physical "tube" of the neon light */}
                <View style={{
                    width: width,
                    height: height,
                    backgroundColor: '#000', // Black center looks best for neon
                    borderColor: color,      // The actual colored bright tube rim
                    borderWidth: 3,          // Thickness of the tube rim
                    borderRadius: 4,         // Slight rounding looks more realistic
                    // Optional: Add a slight inner glow for extra realism
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 5,
                    elevation: 5 // Android inner glow fallback
                }} />
            </Shadow>
        </View>
    );
};

export default NeonBox;