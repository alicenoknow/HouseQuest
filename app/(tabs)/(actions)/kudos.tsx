import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Kudos: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Kudos</Text>
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

export default Kudos;
