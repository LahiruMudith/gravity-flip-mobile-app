import { Slot, Stack } from "expo-router"
import Toast from "react-native-toast-message";
import {toastConfig} from "@/app/constants/toastConfig";


const AuthLayout = () => {
    return(
        <>
            <Stack
                screenOptions={{
                    headerShown:false,
                    animation:"fade"
                }}
            >
                <Stack.Screen name="login" options={{title: 'Login'}}/>
                <Stack.Screen name="signup" options={{title: 'Sign Up'}}/>
            </Stack>
        </>
    )
}

export default AuthLayout;