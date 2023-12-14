import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { KudosOrSlobs, Type } from '../../../models';
import Colors from '../../../constants/Colors';

// TODO refactor, basically rewrite, extract components, fix styling

const data: ReadonlyArray<KudosOrSlobs> = [
    {
        type: Type.KUDOS,
        sender: 'Sender1',
        receiver: 'Receiver1',
        message: 'Great job on the project!',
        timestamp: new Date(),
        points: 10,
    },
    {
        type: Type.SLOBS,
        sender: 'Sender2',
        receiver: 'Receiver2',
        message: 'Thanks for the help!',
        timestamp: new Date(),
    }
];

const Kudos: React.FC = () => {
    const renderMessage = (item: KudosOrSlobs) => {
        const borderColor = item.type === Type.KUDOS ? Colors.lightGreen : Colors.pink;

        return (
            <View style={[styles.messageContainer, { borderColor }]}>
                <View style={styles.avatars}>
                    {/* <Avatar username={item.sender} />
                    <Avatar username={item.receiver} /> */}
                </View>
                <Text>{item.message}</Text>
                <Text>{item.points}</Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: KudosOrSlobs }) => {
        return (
            <View style={styles.item}>
                {renderMessage(item)}
                {item.points && <Text style={styles.points}>Points: {item.points}</Text>}
                <Text>Sender: {item.sender}</Text>
                <Text>Receiver: {item.receiver}</Text>
                <Text>Timestamp: {item.timestamp.toISOString()}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    messageContainer: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatars: {
        flexDirection: 'row',
        marginRight: 10,
    },
    avatar: {
        backgroundColor: 'lightgray',
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        lineHeight: 30,
        marginRight: 5,
    },
    points: {
        marginTop: 5,
        fontWeight: 'bold',
    },
});

export default Kudos;
