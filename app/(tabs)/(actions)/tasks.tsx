import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../../models';
import Colors from '../../../constants/Colors';
import { useTaskContext } from '../../../contexts';
import TaskItem from '../../../components/actions/tasks/TaskItem';
import AddTaskModal from '../../../components/actions/tasks/AddTaskModal';
import Fonts from '../../../constants/Fonts';
import Spacers from '../../../constants/Spacers';
import Style from '../../../constants/Style';
import TaskDetailsModal from '../../../components/actions/tasks/TaskDetailsModal';

/**
 * TODO extras:
 * 1. Predefined tasks and list of saved tasks
 * 2. Random assignment of tasks ore gamified
 * 3. Edit task by creator
 */

const Tasks: React.FC = () => {
    const { state: { tasks } } = useTaskContext();

    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

    const onTaskPressed = (task: Task) => {
        setSelectedTask(task);
        setDetailsModalVisible(true);
    }

    const renderTask = ({ item, index }: { item: Task; index: number }) => {
        return (
            <TaskItem index={index} task={item} onTaskPressed={() => onTaskPressed(item)} />
        );
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(_, index) => index.toString()}
            />
            <TouchableOpacity style={styles.button} onPress={() => setAddModalVisible(!isAddModalVisible)}>
                <Text style={styles.buttonText}>Add new task</Text>
            </TouchableOpacity>
            <AddTaskModal isModalVisible={isAddModalVisible} setModalVisible={setAddModalVisible} />
            {selectedTask && <TaskDetailsModal task={selectedTask} isModalVisible={isDetailsModalVisible} setModalVisible={setDetailsModalVisible} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacers.medium,
    },
    button: {
        backgroundColor: Colors.darkGreen,
        margin: Spacers.medium,
        padding: Spacers.medium,
        alignItems: 'center',
        borderRadius: Style.radius,
    },
    buttonText: {
        fontSize: Fonts.medium,
        fontWeight: "bold",
        color: Colors.white,
    }
});

export default Tasks;
