import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import the types you created above

// Define the navigation prop type for this screen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigation is usually handled automatically by an onAuthStateChanged listener in your App.tsx
            // But if you handle it manually:
            // navigation.replace('Home');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
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
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text className="text-green-400 font-bold">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}