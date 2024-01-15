import { Stack } from 'expo-router';
import { StyleSheet, SafeAreaView } from 'react-native';
import Spacers from '../../../constants/Spacers';

export const unstable_settings = {
    initialRouteName: 'actions',
};


export default function Layout() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="actions" />
                <Stack.Screen name="kudos" />
                <Stack.Screen name="rewards" />
                <Stack.Screen name="statistics" options={{ headerTitle: "Statistics", headerTitleAlign: 'center' }} />
                <Stack.Screen name="tasks" />
            </Stack>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});