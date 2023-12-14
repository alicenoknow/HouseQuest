import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';
import { Reward, RewardStatus } from '../../../models';

// TODO refactor, basically rewrite, extract components, fix styling

const rewardsData: ReadonlyArray<Reward> = [
    {
        title: 'Reward 1',
        description: 'Description for Reward 1',
        createdAt: new Date(),
        creator: 'B',
        recipient: 'A',
        status: RewardStatus.AVAILABLE,
        points: 50,
    },
    {
        title: 'Reward 2',
        description: 'Description for Reward 2',
        createdAt: new Date(),
        creator: 'A',
        status: RewardStatus.REQUESTED,
    },
];

const Rewards: React.FC = () => {
    const renderReward = ({ item }: { item: Reward }) => {
        const handleGetReward = () => {
            return
        };

        return (
            <View style={styles.rewardItem}>
                <Text>Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                {item.points && <Text>Points: {item.points}</Text>}
                <Text>Creator: {item.creator}</Text>
                <Text>Status: {RewardStatus[item.status]}</Text>
                {item.status === RewardStatus.AVAILABLE && (
                    <TouchableOpacity onPress={handleGetReward} style={styles.button}>
                        <Text>Get Reward</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={rewardsData}
                renderItem={renderReward}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    rewardItem: {
        borderWidth: 1,
        borderColor: Colors.darkGreen,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: Colors.yellow,
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
});

export default Rewards;
