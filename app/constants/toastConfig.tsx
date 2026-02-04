import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';

export const toastConfig = {
    /* Overwrite 'success' type or create a custom one like 'gameSuccess'
    */
    success: (props:any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#00FF00', // Neon Green border
                backgroundColor: '#1A1A1A', // Dark background for game feel
                height: 70,
                width: '90%'
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 17,
                fontWeight: 'bold',
                color: '#FFFFFF' // White text
            }}
            text2Style={{
                fontSize: 14,
                color: '#BBBBBB'
            }}
        />
    ),

    // You can also customize the error style
    error: (props:any) => (
        <ErrorToast
            {...props}
            style={{ backgroundColor: '#1A1A1A', borderLeftColor: '#FF3B30' }}
            text1Style={{ color: '#FFFFFF' }}
            text2Style={{ color: '#BBBBBB' }}
        />
    )
};