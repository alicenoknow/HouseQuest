import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{ headerTitle: "Share your todos", headerTitleAlign: "center" }} />
    );
}
