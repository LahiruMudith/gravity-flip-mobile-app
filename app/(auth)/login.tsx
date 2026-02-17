import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/app/constants/toastConfig";
import { RootStackParamList } from '../constants/types';

import { loginUser, loginWithGoogle } from "@/services/authService";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) return Toast.show({
            type: 'error',
            text1: 'Missing Field',
        });

        setLoading(true);
        try {
            await loginUser(email, password);
            Toast.show({ type: 'success', text1: 'Login Successful', position: 'top' });
            router.replace('/home');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Login Failed', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            // Call the clean service function
            await loginWithGoogle();

            Toast.show({
                type: 'success',
                text1: 'Google Login Successful',
                position: 'top',
            });
            router.replace('/home');

        } catch (error: any) {
            console.log("Google Auth Error:", error);

            if (error.message !== "cancelled") {
                Toast.show({
                    type: 'error',
                    text1: 'Google Login Failed',
                    text2: error.message || 'Something went wrong',
                });
            }
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

            <View className="flex-row items-center my-6 w-full">
                <View className="flex-1 h-[1px] bg-gray-700" />
                <Text className="text-gray-500 px-4 font-bold">OR</Text>
                <View className="flex-1 h-[1px] bg-gray-700" />
            </View>

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

            <View className="flex-row mt-8">
                <Text className="text-gray-400">Don&#39;t have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                    <Text className="text-green-400 font-bold">Sign Up</Text>
                </TouchableOpacity>
            </View>
            <Toast config={toastConfig}/>
        </View>
    );
}