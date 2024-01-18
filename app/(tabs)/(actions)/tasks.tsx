import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskStatus } from '../../../models';
import Colors from '../../../constants/Colors';

// TODO refactor, basically rewrite, extract components, fix styling

const tasksData: ReadonlyArray<Task> = [
    {
        id: "123",
        title: 'Task 1',
        description: 'Description for Task 1',
        createdAt: new Date(),
        creator: 'A',
        status: TaskStatus.UNASSIGNED,
    },
    {
        id: "432",
        title: 'Task 2',
        description: 'Description for Task 2',
        createdAt: new Date(),
        creator: 'B',
        assignee: 'Assignee Y',
        status: TaskStatus.ASSIGNED,
    },
];

const Tasks: React.FC = () => {
    const renderTask = ({ item }: { item: Task }) => {
        const handleTaskAction = () => {
            return
        };

        return (
            <View style={styles.taskItem}>
                <Text>Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                <Text>Creator: {item.creator}</Text>
                <Text>Assignee: {item.assignee}</Text>
                <Text>Status: {TaskStatus[item.status]}</Text>
                {item.status === TaskStatus.ASSIGNED && (
                    <TouchableOpacity onPress={handleTaskAction} style={styles.button}>
                        <Text>Submit Task</Text>
                    </TouchableOpacity>
                )}
                {item.status === TaskStatus.SUBMITTED && (
                    <TouchableOpacity onPress={handleTaskAction} style={styles.button}>
                        <Text>Confirm Task</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={tasksData}
                renderItem={renderTask}
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
    taskItem: {
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

export default Tasks;
