import { Stack } from 'expo-router';

// export const unstable_settings = {
//     initialRouteName: 'actions',
// };

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="actions" />
            <Stack.Screen name="kudos" />
            <Stack.Screen name="rewards" />
            <Stack.Screen name="statistics" />
            <Stack.Screen name="tasks" />
        </Stack>
    );
}