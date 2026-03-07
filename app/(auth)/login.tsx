import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Stack } from 'expo-router';
import { RootStackParamList } from '../constants/types';
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/app/constants/toastConfig";

// Standard Auth Imports
import { loginUser } from "@/services/authService";

// --- NEW GOOGLE AUTH IMPORTS ---
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/services/firebase';

// Define the navigation prop type for this screen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

// --- CONFIGURE GOOGLE SIGN-IN ---
// It's safe to do this outside the component so it runs once
GoogleSignin.configure({
    // REPLACE THIS with your actual Firebase Web Client ID
    webClientId: "103850846573-lu8538if3ojb2uofmbpldkknomt1l8hm.apps.googleusercontent.com",
});

export default function LoginScreen({ navigation }: Props) {
    const router = useRouter();

    // States
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // New State for Google Loading
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

    // --- STANDARD EMAIL LOGIN LOGIC ---
    const handleLogin = async () => {
        if (!email || !password) return Toast.show({
            type: 'error',
            text1: 'Missing Field',
        });

        setLoading(true);
        try {
            await loginUser(email, password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                position: 'top',
            });
            router.replace('/home');
        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // --- NEW GOOGLE LOGIN LOGIC ---
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            // 1. Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices();

            // 2. Open Google Login prompt and get the response
            const response = await GoogleSignin.signIn();
            console.log(response)

            // 3. NEW LOGIC: Check if it was successful using the built-in helper
            if (isSuccessResponse(response)) {
                // The idToken is now nested under .data
                const idToken = response.data.idToken;

                if (!idToken) throw new Error("No ID token found");

                // 4. Create a Firebase credential with the Google token
                const googleCredential = GoogleAuthProvider.credential(idToken);

                // 5. Sign in to Firebase
                await signInWithCredential(auth, googleCredential);

                Toast.show({
                    type: 'success',
                    text1: 'Google Login Successful',
                    position: 'top',
                });

                // 6. Navigate to game
                router.replace('/home');
            } else {
                // This block catches if the user simply closed the Google popup
                console.log("Sign in was cancelled by the user");
            }

        } catch (error: any) {
            console.log("Google Auth Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Google Login Failed',
                text2: error.message || 'Something went wrong',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };
    return (
        <View className="flex-1 justify-center items-center bg-gray-900 p-6">
            <Text className="text-4xl font-bold text-green-400 mb-2 tracking-widest">
                GRAVITY FLIP
            </Text>
            <Text className="text-gray-400 mb-10 text-lg">Login to Start Running</Text>

            {/* Email Input */}
            <View className="w-full mb-4">
                <Text className="text-gray-300 mb-2 ml-1">Email</Text>
                <TextInput
                    className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-green-500"
                    placeholder="runner@example.com"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Password Input */}
            <View className="w-full mb-8">
                <Text className="text-gray-300 mb-2 ml-1">Password</Text>
                <TextInput
                    className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-green-500"
                    placeholder="••••••••"
                    placeholderTextColor="#6b7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            {/* Email Login Button */}
            <TouchableOpacity
                className="w-full bg-green-500 p-4 rounded-xl items-center shadow-lg shadow-green-500/50"
                onPress={handleLogin}
                disabled={loading || isGoogleLoading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text className="text-gray-900 font-bold text-lg">LOG IN</Text>
                )}
            </TouchableOpacity>

            {/* --- NEW DIVIDER --- */}
            <View className="flex-row items-center my-6 w-full">
                <View className="flex-1 h-[1px] bg-gray-700" />
                <Text className="text-gray-500 px-4 font-bold">OR</Text>
                <View className="flex-1 h-[1px] bg-gray-700" />
            </View>

            {/* --- NEW GOOGLE LOGIN BUTTON --- */}
            <TouchableOpacity
                className="w-full bg-white p-4 rounded-xl items-center flex-row justify-center shadow-lg"
                onPress={handleGoogleLogin}
                disabled={loading || isGoogleLoading}
            >
                {isGoogleLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text className="text-gray-900 font-bold text-lg">Continue with Google</Text>
                )}
            </TouchableOpacity>

            {/* Toggle to Signup */}
            <View className="flex-row mt-8">
                <Text className="text-gray-400">Don&#39;t have an account? </Text>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/signup');
                    }}
                >
                    <Text className="text-green-400 font-bold">Sign Up</Text>
                </TouchableOpacity>
            </View>
            <Toast config={toastConfig}/>
        </View>
    );
}