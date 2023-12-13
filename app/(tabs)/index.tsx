import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchAnnouncements } from '../../remote/db';

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
