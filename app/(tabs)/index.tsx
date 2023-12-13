import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, SafeAreaView } from 'react-native';
import { Announcement, Role, User } from '../../models';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import Colors from '../../constants/Colors';

const announcementsList: Announcement[] = [
    { id: '1', sender: 'User 1', createdAt: new Date(), content: 'Announcement 1' },
    { id: '2', sender: 'User 2', createdAt: new Date(), content: 'Announcement 2' },
];

const usersList: User[] = [
    { id: '1', name: 'User 1', role: Role.PARENT, totalPoints: 100, currentPoints: 50, avatarUri: "https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png" },
    { id: '2', name: 'User 2', role: Role.CHILD, totalPoints: 80, currentPoints: 60, avatarUri: "https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png" },
];

const Dashboard: React.FC = () => {
    const renderAnnouncement = ({ item }: { item: Announcement }) => {
        return (
            <View style={styles.announcementContainer}>
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        );
    };

    const renderUserAvatar = ({ item }: { item: User }) => {
        return (
            <TouchableOpacity style={styles.userAvatar} onPress={() => console.log(`Tapped ${item.name}`)}>
                <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    horizontal
                    data={usersList}
                    renderItem={renderUserAvatar}
                    keyExtractor={(item) => item.id}
                    style={styles.userList}
                />
            </View>
            <FlatList
                style={styles.userList}
                data={announcementsList}
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={() => console.log('Send button pressed')}>
                    <Text style={styles.sendButton}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Spacers.xLarge,
    },
    announcementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        backgroundColor: Colors.lightGreen,
        borderRadius: Style.radius,
    },
    userAvatar: {
        borderRadius: 50,
        backgroundColor: Colors.pink,
        padding: Spacers.small,
        margin: Spacers.small
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 8,
    },
    sendButton: {
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: Colors.darkGreen,
        borderRadius: 10,
        color: 'white',
    },
    messageText: {
        marginLeft: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,
    },
    userList: {
        padding: 10,
    },
    announcementsList: {
        flex: 1,
        padding: 10,
    },
});

export default Dashboard;
