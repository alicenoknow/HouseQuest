import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Statistics: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Statistics</Text>
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

export default Statistics;
