import { Slot, Stack } from "expo-router"
import Toast from "react-native-toast-message";
import {toastConfig} from "@/app/constants/toastConfig";
import '@/global.css'


const DashboardLayout = () => {
    return(
        <>
            <Stack
                screenOptions={{
                    headerShown:false,
                    animation:"fade"
                }}
            >
                <Stack.Screen name="home" options={{title: 'Home'}}/>
                <Stack.Screen name="game" options={{title: 'Game'}}/>
            </Stack>
        </>
    )
}

export default DashboardLayout;