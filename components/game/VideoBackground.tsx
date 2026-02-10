import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('screen');

const VideoBackground = (props: any) => {
    return (
        <Video
            source={require('../../assets/space_bg.mp4')} // <--- Your video file
            style={styles.video}
            rate={1.0}
            volume={0.0}
            isMuted={true}
            resizeMode={ResizeMode.COVER} // Ensures it fills the screen
            shouldPlay
            isLooping
        />
    );
};

const styles = StyleSheet.create({
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: -1, // Keep it behind everything
    },
});

export default VideoBackground;