import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../../models';
import Colors from '../../../constants/Colors';
import { useTaskContext, useUserContext } from '../../../contexts';
import TaskItem from '../../../components/actions/tasks/TaskItem';
import AddTaskModal from '../../../components/actions/tasks/AddTaskModal';
import Fonts from '../../../constants/Fonts';
import Spacers from '../../../constants/Spacers';
import Style from '../../../constants/Style';


const Tasks: React.FC = () => {
    const { state: { tasks }, dispatch: dispatchTask } = useTaskContext();
    const { state: { user }, dispatch: dispatchUser } = useUserContext();

    const [isModalVisible, setModalVisible] = useState(false);

    const renderTask = ({ item }: { item: Task }) => {
        return (
            <TaskItem task={item} handleTaskAction={() => { }} />
        );
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(_, index) => index.toString()}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(!isModalVisible)}>
                <Text style={styles.buttonText}>Add new task</Text>
            </TouchableOpacity>
            <AddTaskModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacers.medium,
    },
    button: {
        backgroundColor: Colors.lightGreen,
        margin: Spacers.medium,
        padding: Spacers.medium,
        alignItems: 'center',
        borderRadius: Style.radius,
    },
    buttonText: {
        fontSize: Fonts.medium,
    }
});

export default Tasks;
