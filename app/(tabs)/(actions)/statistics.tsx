import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO refactor, basically rewrite, extract components, fix styling

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
