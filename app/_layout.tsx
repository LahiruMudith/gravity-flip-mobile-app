import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from './constants/toastConfig'; // If you chose Option A

export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </>
    );
}