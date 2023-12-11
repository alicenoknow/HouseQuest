import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Dashboard</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Dashboard;
