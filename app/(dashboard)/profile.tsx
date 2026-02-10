import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Modal, TextInput,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Image, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '@/services/firebase'; // Adjust path if needed
import Toast from 'react-native-toast-message';

// Import Services
import { updateUserName, updateUserEmail, updateUserPassword, saveProfileUrlToFirebase } from '@/services/profileService';
import { logoutUser } from '@/services/authService'; // Assuming you have this from before
import { uploadToCloudinary } from '@/services/cloudinaryService';
import {toastConfig} from "@/constants/toastConfig";

export default function ProfileScreen() {
    const router = useRouter();

    // --- STATE ---
    const [activeModal, setActiveModal] = useState<"none" | "edit-profile" | "email" | "password">("none");
    const [isLoading, setIsLoading] = useState(false);

    // User Data State
    const [user, setUser] = useState({
        name: auth.currentUser?.displayName || "Cyber Player",
        email: auth.currentUser?.email || "player@websonic.com",
        photo: auth.currentUser?.photoURL || null,
        highScore: 0, // Replace with real Firestore data later
        lastScore: 0,
    });

    // Form States
    const [tempName, setTempName] = useState(user.name);
    const [tempEmail, setTempEmail] = useState("");
    const [tempPassword, setTempPassword] = useState("");

    // --- IMAGE PICKER ---
    const handleAvatarPress = () => {
        Alert.alert(
            "Update Profile Photo",
            "Choose an option",
            [
                { text: "Take Photo", onPress: takePhoto },
                { text: "Choose from Gallery", onPress: pickImage },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    // 1. The Helper Function (Defines what happens when an image is ready)
    const handleImageUpload = async (uri: string) => {
        setIsLoading(true);
        try {
            const cloudinaryUrl = await uploadToCloudinary(uri);
            await saveProfileUrlToFirebase(cloudinaryUrl);
            setUser({ ...user, photo: cloudinaryUrl });

            // SUCCESS TOAST
            Toast.show({
                type: 'success',
                text1: 'Photo Updated',
                visibilityTime: 3000,
            });

        } catch (error: any) {
            // ERROR TOAST
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
            });
        } finally {
            setIsLoading(false);
        }
    };


    // 2. Update Gallery Logic
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5, // Lower quality slightly for faster uploads
        });

        if (!result.canceled) {
            // CALL IT HERE:
            await handleImageUpload(result.assets[0].uri);
        }
    };

    // 3. Update Camera Logic
    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Toast.show({
                type: 'error',
                text1: 'Permission Required',
            });
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            // CALL IT HERE:
            await handleImageUpload(result.assets[0].uri);
        }
    };

    // --- SERVICE HANDLERS ---

    const handleUpdateName = async () => {
        if (!tempName.trim()) return;
        setIsLoading(true);
        try {
            await updateUserName(tempName);
            setUser({ ...user, name: tempName });
            setActiveModal("none");

            // SUCCESS TOAST
            Toast.show({
                type: 'success',
                text1: 'Username Updated',
            });

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!tempEmail.trim()) return;
        setIsLoading(true);
        try {
            await updateUserEmail(tempEmail);
            setUser({ ...user, email: tempEmail }); // Update UI
            setActiveModal("none");
            Toast.show({
                type: 'success',
                text1: 'Email Updated',
            });
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                Toast.show({
                    type: 'error',
                    text1: 'Please Log Again',
                });
                router.replace('/login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!tempPassword.trim()) return;
        setIsLoading(true);
        try {
            await updateUserPassword(tempPassword);
            setActiveModal("none");
            Toast.show({
                type: 'success',
                text1: 'Password Updated',
            });
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                Toast.show({
                    type: 'error',
                    text1: 'Please Log Again',
                });
                router.replace('/login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Update Failed',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            router.replace('/'); // Go back to login
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Fail to Log Out',
            });
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* HEADER */}
            <View className="pt-14 px-6 mb-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-zinc-800 rounded-xl border border-zinc-700 items-center justify-center active:bg-zinc-700 shadow-lg shadow-black/50"
                >
                    <Ionicons name="arrow-back" size={24} color="#4ade80" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">

                {/* HERO SECTION */}
                <View className="items-center mb-10">
                    <View className="w-32 h-32 bg-zinc-900 rounded-full border-4 border-green-400 items-center justify-center mb-4 shadow-2xl shadow-green-500/40 relative overflow-hidden">
                        {user.photo ? (
                            <Image source={{ uri: user.photo }} className="w-full h-full" />
                        ) : (
                            <Ionicons name="person" size={64} color="#4ade80" />
                        )}
                        <TouchableOpacity
                            onPress={handleAvatarPress}
                            className="absolute bottom-0 right-0 bg-white p-2 rounded-full border-4 border-black z-10"
                        >
                            <Ionicons name="camera" size={16} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-3xl font-extrabold text-white tracking-wider">{user.name}</Text>
                    <Text className="text-zinc-500 font-medium text-base mt-1">{user.email}</Text>
                </View>

                {/* STATS */}
                <View className="flex-row justify-between mb-10">
                    <StatCard icon="trophy" color="#fbbf24" label="High Score" value={user.highScore} />
                    <StatCard icon="time" color="#4ade80" label="Last Run" value={user.lastScore} />
                </View>

                {/* MENU */}
                <Text className="text-zinc-500 font-bold uppercase tracking-widest mb-4 px-2">Manage Account</Text>
                <View className="space-y-3 mb-10">
                    <MenuItem icon="person-outline" label="Edit Profile" onPress={() => { setTempName(user.name); setActiveModal("edit-profile"); }} />
                    <MenuItem icon="mail-outline" label="Update Email" onPress={() => { setTempEmail(""); setActiveModal("email"); }} />
                    <MenuItem icon="lock-closed-outline" label="Change Password" onPress={() => { setTempPassword(""); setActiveModal("password"); }} />
                </View>

                {/* LOGOUT */}
                <TouchableOpacity
                    className="flex-row items-center justify-center bg-red-500/10 border border-red-500/50 p-4 rounded-2xl active:bg-red-500/20 mb-12"
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" style={{ marginRight: 10 }} />
                    <Text className="text-red-500 font-bold text-lg tracking-wide">LOG OUT</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* --- MODALS --- */}

            {/* 1. Edit Profile */}
            <CyberModal visible={activeModal === "edit-profile"} title="Edit Profile" onClose={() => setActiveModal("none")}>
                <InputLabel label="Username" />
                <StyledInput value={tempName} onChangeText={setTempName} placeholder="Enter username" autoFocus={true}/>
                <ActionButton label="Save Changes" onPress={handleUpdateName} loading={isLoading} color="bg-green-500" />
            </CyberModal>

            {/* 2. Update Email */}
            <CyberModal visible={activeModal === "email"} title="Update Email" onClose={() => setActiveModal("none")}>
                <InputLabel label="Current Email" />
                <View className="bg-zinc-800 p-4 rounded-xl mb-6 border border-zinc-700"><Text className="text-zinc-400">{user.email}</Text></View>
                <InputLabel label="New Email" />
                <StyledInput value={tempEmail} onChangeText={setTempEmail} placeholder="Enter new email..." keyboardType="email-address" />
                <ActionButton label="Update Email" onPress={handleUpdateEmail} loading={isLoading} color="bg-zinc-700" />
            </CyberModal>

            {/* 3. Change Password */}
            <CyberModal visible={activeModal === "password"} title="Change Password" onClose={() => setActiveModal("none")}>
                <InputLabel label="New Password" />
                <StyledInput value={tempPassword} onChangeText={setTempPassword} secureTextEntry placeholder="••••••••" />
                <ActionButton label="Set New Password" onPress={handleUpdatePassword} loading={isLoading} color="bg-red-500" />
            </CyberModal>
            <Toast config={toastConfig} />
        </View>
    );
}

// --- COMPONENTS ---

const MenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 active:bg-zinc-800">
        <View className="w-10 h-10 bg-black rounded-full items-center justify-center mr-4 border border-zinc-800">
            <Ionicons name={icon} size={20} color="white" />
        </View>
        <Text className="text-white font-bold text-base flex-1">{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#52525b" />
    </TouchableOpacity>
);

const StatCard = ({ icon, color, label, value }: any) => (
    <View className="bg-zinc-900 w-[48%] p-5 rounded-3xl border border-zinc-800 items-center shadow-lg">
        <Ionicons name={icon} size={24} color={color} className="mb-2" />
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</Text>
        <Text className="text-white text-3xl font-black tracking-tighter shadow-black/50">{value}</Text>
    </View>
);

const InputLabel = ({ label }: { label: string }) => (
    <Text className="text-zinc-500 mb-2 uppercase text-xs font-bold tracking-wider ml-1">{label}</Text>
);

const StyledInput = (props: any) => (
    <TextInput className="bg-black text-white p-4 rounded-xl border border-zinc-700 focus:border-green-500 mb-6" placeholderTextColor="#52525b" {...props} />
);

const ActionButton = ({ label, onPress, color, loading }: any) => (
    <TouchableOpacity onPress={onPress} disabled={loading} className={`${color} py-4 rounded-xl items-center mt-2 shadow-lg active:opacity-80`}>
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg uppercase tracking-wider">{label}</Text>}
    </TouchableOpacity>
);

const CyberModal = ({ visible, title, onClose, children }: any) => (
    <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end">
            <TouchableWithoutFeedback onPress={onClose}><View className="absolute inset-0 bg-black/80" /></TouchableWithoutFeedback>
            <View className="bg-zinc-900 border-t-2 border-green-500 rounded-t-3xl p-6 pb-12 shadow-2xl shadow-green-900/50">
                <View className="items-center mb-6"><View className="w-12 h-1.5 bg-zinc-700 rounded-full" /></View>
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-white text-xl font-bold uppercase tracking-wider">{title}</Text>
                    <TouchableOpacity onPress={onClose} className="bg-zinc-800 p-2 rounded-full"><Ionicons name="close" size={20} color="white" /></TouchableOpacity>
                </View>
                {children}
            </View>
        </KeyboardAvoidingView>
    </Modal>
);