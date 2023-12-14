import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// TODO refactor, basically rewrite, extract components, fix styling

interface ProfileProps {
    photo: string;
    name: string;
    score: number;
    birthday: string;
    householdName: string;
    onPressSettings: () => void;
}

const Profile: React.FC<ProfileProps> = ({
    photo,
    name,
    score,
    birthday,
    householdName,
    onPressSettings,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Image source={{ uri: photo }} style={styles.profileImage} />
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.score}>Score: {score}</Text>
                <Text style={styles.birthday}>Birthday: {birthday}</Text>
                <Text style={styles.householdName}>Household: {householdName}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={onPressSettings}>
                <Text style={styles.settingsText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    score: {
        fontSize: 18,
        marginBottom: 5,
    },
    birthday: {
        fontSize: 16,
        marginBottom: 5,
    },
    householdName: {
        fontSize: 16,
        marginBottom: 20,
    },
    settingsButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    settingsText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Profile;
