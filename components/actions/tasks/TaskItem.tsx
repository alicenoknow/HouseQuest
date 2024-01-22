import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../../models';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Spacers from '../../../constants/Spacers';
import Fonts from '../../../constants/Fonts';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface TaskItemProps {
    index: number;
    task: Task;
    onTaskPressed: () => void;
}

const taskItemsColors = [Colors.lightBlue, Colors.lightGreen, Colors.yellow];

export default function TaskItem({ index, task, onTaskPressed }: TaskItemProps) {
    const itemColor = taskItemsColors[index % taskItemsColors.length];
    const { title, status, points } = task;
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity style={[styles.container, { backgroundColor: itemColor }]} onPress={onTaskPressed}>
                <View style={styles.circle}>
                    <Text style={styles.pointsText}>{`🔥${points}` ?? "🛠"}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.status}>{status}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        padding: Spacers.medium,
        marginTop: Spacers.medium,
        borderRadius: Style.largeRadius,
        flexDirection: "row",
        alignItems: "center"
    },
    circle: {
        width: 90,
        height: 60,
        borderRadius: Style.xLargeRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacers.medium,
        marginRight: Spacers.large,
        backgroundColor: Colors.white,
        padding: Spacers.small,
    },
    pointsText: {
        fontSize: Fonts.large,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: Fonts.medium,
        fontWeight: 'bold',
        marginBottom: Spacers.small,
    },
    status: {
        fontSize: Fonts.medium,
        color: Colors.darkGrey,
        marginBottom: Spacers.small,
    },
});