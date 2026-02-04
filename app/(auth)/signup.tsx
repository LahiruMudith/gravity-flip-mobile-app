import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// 1. Import updateProfile
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/types';
import { useRouter } from "expo-router";
import {registerUser} from "@/services/authService";
import Toast from 'react-native-toast-message';


type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

type Props = {
    navigation: SignupScreenNavigationProp;
};

export default function SignupScreen({ navigation }: Props) {
    const router = useRouter();
    // 2. Add state for Full Name
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignup = async () => {
        // 3. Update validation
        if (!email || !password || !fullName) {
            Toast.show({
                type: 'error',
                text1: 'Please fill in all fields',
            });
            return;
        }

        setLoading(true);
        try {
            // Create the user
            const userCredential = await registerUser(email, password, fullName);

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: fullName
                });
            }
            Toast.show({
                type: 'success',
                text1: 'Account Created!',
                text2: 'You can now save your high scores to the leaderboard.',
            });

            router.replace('/login');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Signup Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-900 p-6">
            <Text className="text-3xl font-bold text-white mb-2">
                Join the Race
            </Text>
            <Text className="text-gray-400 mb-10 text-base">Create an account to save your scores</Text>

            {/* 5. Full Name Input Field */}
            <View className="w-full mb-4">
                <Text className="text-gray-300 mb-2 ml-1">Full Name</Text>
                <TextInput
                    className="w-full bg-gray-800 text-white p-4 rounded-xl border border-gray-700 focus:border-green-500"
                    placeholder="John Doe"
                    placeholderTextColor="#6b7280"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                />
            </View>

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

            {/* Signup Button */}
            <TouchableOpacity
                className="w-full bg-white p-4 rounded-xl items-center shadow-lg"
                onPress={handleSignup}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text  className="text-gray-900 font-bold text-lg">SIGN UP</Text>
                )}
            </TouchableOpacity>

            {/* Toggle to Login */}
            <View className="flex-row mt-6">
                <Text className="text-gray-400">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text className="text-green-400 font-bold">Log In</Text>
                </TouchableOpacity>
            </View>
            <Toast />
        </View>
    );
}