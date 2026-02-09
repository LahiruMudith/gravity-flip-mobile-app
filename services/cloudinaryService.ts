// Replace these with your actual Cloudinary values
const CLOUD_NAME = process.env.EXPO_PUBLIC_FIREBASE_CLOUD_NAME as string;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_FIREBASE_UPLOAD_PRESET as string;

export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    try {
        // 1. Create a form data object
        const data = new FormData();

        // 2. Append the file (React Native specific format)
        // @ts-ignore: FormData expects a specific structure in RN
        data.append('file', {
            uri: imageUri,
            type: 'image/jpeg', // Adjust if you allow PNGs
            name: 'upload.jpg',
        });

        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', CLOUD_NAME);

        // 3. Send to Cloudinary API
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: data,
            }
        );

        const result = await response.json();

        // 4. Check for errors
        if (result.error) {
            throw new Error(result.error.message);
        }

        // 5. Return the secure URL (https)
        return result.secure_url;

    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image.");
    }
};