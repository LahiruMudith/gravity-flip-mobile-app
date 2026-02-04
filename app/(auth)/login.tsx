import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/types';
import {useRouter} from "expo-router";
import {loginUser} from "@/services/authService"; // Import the types you created above
import Toast from 'react-native-toast-message';
import {toastConfig} from "@/app/constants/toastConfig";

// Define the navigation prop type for this screen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
    const router = useRouter()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) return Toast.show({
            type: 'error',
            text1: 'Missing Field',
        });

        setLoading(true);
        try {
            const userCredential = await loginUser(email, password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                position: 'top',
            });
            // No need to navigate manually if you have an auth listener in App.tsx
        } catch (error: any) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message,
            });
        } finally {
            setLoading(false);
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

            {/* Login Button */}
            <TouchableOpacity
                className="w-full bg-green-500 p-4 rounded-xl items-center shadow-lg shadow-green-500/50"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text className="text-gray-900 font-bold text-lg">LOG IN</Text>
                )}
            </TouchableOpacity>

            {/* Toggle to Signup */}
            <View className="flex-row mt-6">
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