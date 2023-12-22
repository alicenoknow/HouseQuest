import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, SafeAreaView } from 'react-native';
import { Announcement, Role, User } from '../../models';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import { Text } from "../../components/Themed";
import Colors from '../../constants/Colors';

// TODO refactor, basically rewrite, extract components, fix styling


const announcementsList: Announcement[] = [
    { id: '1', sender: 'User 1', createdAt: new Date(), content: 'Shower is not working, please DO NOT USE IT! t will be fixed tomorrow.' },
    { id: '2', sender: 'User 2', createdAt: new Date(), content: 'Greetings from Iceland!', photoUri: "https://www.happiness.com/en/uploads/monthly_2019_07/iceland-happy-people.jpg.49f396d9196668eddb06cf311d0732d9.jpg" },
];

const usersList: User[] = [
    { id: '1', name: 'User 1', role: Role.PARENT, totalPoints: 100, currentPoints: 50, avatarUri: "https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png" },
    { id: '2', name: 'User 2', role: Role.CHILD, totalPoints: 80, currentPoints: 60, avatarUri: "https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png" },
];

const Dashboard: React.FC = () => {
    const renderAnnouncement = ({ item }: { item: Announcement }) => {
        return (
            <View style={{
                padding: 10,
                margin: 10,
                backgroundColor: Colors.lightGreen,
                borderRadius: Style.radius,
            }}>
                <View style={styles.announcementContainer}>
                    <Text style={styles.messageText}>{item.content}</Text>
                </View>
                {item.photoUri ? <Image source={{ uri: item.photoUri }} style={styles.annoucementPhoto} /> : null}

            </View>
        );
    };

    const renderUserAvatar = ({ item }: { item: User }) => {
        return (
            <TouchableOpacity style={[styles.userAvatar, { backgroundColor: item.role == Role.CHILD ? Colors.pink : Colors.lightGreen }]} onPress={() => console.log(`Tapped ${item.name}`)}>
                <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.title}>
                    <Text style={styles.title}>Dashboard</Text>
                </View>
                <View style={styles.avatarContainer}>
                    <FlatList
                        horizontal
                        data={usersList}
                        renderItem={renderUserAvatar}
                        keyExtractor={(item) => item.id}
                        style={styles.userList}
                    />
                </View>
            </View>
            <Text style={styles.subtitle}>Announcements</Text>
            <View style={styles.line} />
            <View style={styles.messagesSection}>
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

            </View>



        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Spacers.xLarge,
    },
    subtitle: {
        color: Colors.darkGreen,

        marginLeft: 10,
        marginTop: 30,

    },
    messagesSection: {
        flex: 1,
        width: '100%',
        backgroundColor: '#E8E8E8',

    },
    line: {
        width: '40%',
        height: 0.6,
        backgroundColor: Colors.darkGreen,
        marginTop: 0,
    },
    avatarContainer: {
        backgroundColor: Colors.darkGreen,
        borderRadius: 50,
        width: 300,
        alignItems: 'center',
        height: 55,
        marginLeft: 45,
    },
    announcementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10

    },
    userAvatar: {
        borderRadius: 100,
        padding: 5,
        margin: 5,
        height: 40,
        marginTop: -3,
    },

    annoucementPhoto: {
        height: 220,
        width: 220,
        marginLeft: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,

    },
    input: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
        height: 35,
    },
    sendButton: {
        backgroundColor: Colors.darkGreen,
        borderRadius: Style.radius,
        padding: Spacers.small,
        justifyContent: 'center',
        alignItems: 'center',
        color: "white",
    },
    messageText: {
        marginLeft: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
        margin: 0,
    },
    userList: {
        padding: 10,
    },
    announcementsList: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.black,
        marginLeft: 80,
        marginTop: 10,
        marginBottom: 10,
    },

});

export default Dashboard;
