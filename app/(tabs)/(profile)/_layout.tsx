import { Stack } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'profile',
};

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
