import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { TaskStatus, TaskWithoutId } from '../../../models';
import { Picker } from '@react-native-picker/picker';
import Spacers from '../../../constants/Spacers';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Fonts from '../../../constants/Fonts';
import { TaskActionType, useTaskContext, useUserContext } from '../../../contexts';
import { createTask } from '../../../remote/db';


export default function AddTaskModal({ isModalVisible, setModalVisible }: { isModalVisible: boolean, setModalVisible: (isVisible: boolean) => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(5);
    const [customPoints, setCustomPoints] = useState(0);
    const [assignee, setAssignee] = useState('');

    const { state: { user, householdId, householdMembers } } = useUserContext();
    const { dispatch } = useTaskContext();

    if (user === undefined || householdId === undefined) {
        // TODO handle the user null case
        setModalVisible(false);
        return null;
    }

    const disableAddButton = title === '' || description === '';

    const clearStates = () => {
        setTitle('');
        setDescription('');
        setPoints(5);
        setAssignee('');
    }

    const handleAddButton = async () => {
        const task: TaskWithoutId = {
            title,
            description,
            points: points === undefined ? customPoints : points,
            assignee,
            status: assignee ? TaskStatus.ASSIGNED : TaskStatus.UNASSIGNED,
            creator: user.id,
            createdAt: new Date(Date.now()),
        }
        const taskId = await createTask(task, householdId);
        dispatch({ type: TaskActionType.ADD, task: { ...task, id: taskId } });
        clearStates();
        setModalVisible(!isModalVisible);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(!isModalVisible)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Text style={styles.mediumText}>Title:</Text>
                    <TextInput
                        value={title}
                        onChangeText={text => setTitle(text)}
                        style={styles.input}
                    />

                    <Text style={styles.mediumText}>Description:</Text>
                    <TextInput
                        value={description}
                        onChangeText={text => setDescription(text)}
                        style={styles.input}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.mediumText}>Points:</Text>
                    <Picker
                        selectedValue={points}
                        onValueChange={itemValue => setPoints(itemValue)}
                    >
                        <Picker.Item label="5" value={5} />
                        <Picker.Item label="10" value={10} />
                        <Picker.Item label="15" value={15} />
                        <Picker.Item label="Custom" value={undefined} />
                    </Picker>

                    {points === undefined && (
                        <TextInput
                            placeholder="Enter points"
                            keyboardType="numeric"
                            value={`${customPoints}`}
                            onChangeText={text => { setCustomPoints(Number(text)) }}
                            style={styles.input}
                        />
                    )}

                    <Text style={styles.mediumText}>Assignee:</Text>
                    <Picker
                        selectedValue={assignee}
                        onValueChange={itemValue => setAssignee(itemValue)}
                    >
                        <Picker.Item label="Unassigned" value={undefined} />
                        {householdMembers.map((member) => <Picker.Item key={member.displayName} label={member.displayName} value={member.id} />)}
                    </Picker>

                    <TouchableOpacity
                        style={[styles.button, { opacity: disableAddButton ? 0.5 : 1 }]}
                        disabled={disableAddButton}
                        onPress={handleAddButton}>
                        <Text style={styles.mediumText}>Add Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonCancel]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.mediumText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: Spacers.medium,
    },
    modalView: {
        margin: Spacers.medium,
        backgroundColor: Colors.white,
        borderRadius: Style.largeRadius,
        padding: Spacers.large,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: Colors.yellow,
        marginTop: Spacers.medium,
        padding: Spacers.medium,
        alignItems: 'center',
        borderRadius: Style.radius,
        fontSize: Fonts.large,
    },
    buttonCancel: {
        backgroundColor: Colors.lightGrey,
    },
    mediumText: {
        fontSize: Fonts.medium,
    },
    input: {
        borderColor: Colors.darkGrey,
        borderWidth: 1,
        borderRadius: Style.radius,
        padding: Spacers.small,
        fontSize: Fonts.small,
        marginVertical: Spacers.small

    }

});
