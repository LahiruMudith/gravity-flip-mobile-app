import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Define the navigation prop type for this screen
type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

type Props = {
    navigation: SignupScreenNavigationProp;
};

export default function SignupScreen({ navigation }: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Account created! Logging you in...');
            // Navigation is usually handled automatically by auth listener
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message);
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
                    <Text className="text-gray-900 font-bold text-lg">SIGN UP</Text>
                )}
            </TouchableOpacity>

            {/* Toggle to Login */}
            <View className="flex-row mt-6">
                <Text className="text-gray-400">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className="text-green-400 font-bold">Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}