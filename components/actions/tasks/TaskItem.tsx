import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskStatus } from '../../../models';
import Colors from '../../../constants/Colors';
import { Link } from 'expo-router';
import Style from '../../../constants/Style';
import Spacers from '../../../constants/Spacers';

export default function TaskItem({ handleTaskAction, task }: { handleTaskAction: () => void, task: Task }) {
    return (
        <View style={styles.taskItem}>
            <Text>Title: {task.title}</Text>
            <Text>Description: {task.description}</Text>
            <Text>Creator: {task.creator}</Text>
            <Text>Assignee: {task.assignee}</Text>
            <Text>Status: {TaskStatus[task.status]}</Text>

            <TouchableOpacity onPress={handleTaskAction} style={styles.button}>
                <Link href="/taskModal">Present modal</Link>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacers.medium,
    },
    taskItem: {
        borderWidth: 1,
        borderColor: Colors.darkGreen,
        borderRadius: Style.radius,
        padding: Spacers.medium,
        marginBottom: Spacers.small,
    },
    button: {
        backgroundColor: Colors.yellow,
        marginTop: Spacers.medium,
        padding: Spacers.medium,
        alignItems: 'center',
        borderRadius: Style.radius,
    },
});