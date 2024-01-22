import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TaskStatus, TaskWithoutId } from '../../../models';
import { Spacers, Colors, Style, Fonts } from '../../../constants';
import {
  TaskActionType,
  useTaskContext,
  useUserContext
} from '../../../contexts';
import { createTask } from '../../../remote/db';
import { verifyHousehold, verifyUser } from '../../../functions/verify';
import { router } from 'expo-router';
import {
  useKudosOrSlobsContext,
  KudosOrSlobsActionType
} from '../../../contexts';
import { KSAction } from '../../../models';
import { BlurView } from '@react-native-community/blur';

export default function AddFeedbackModal({
  isModalVisible,
  setModalVisible
}: {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(5);
  const [customPoints, setCustomPoints] = useState(0);
  const [assignee, setAssignee] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState<KSAction>(KSAction.KUDOS);

  const {
    state: { user, householdId, householdMembers }
  } = useUserContext();
  const { dispatch } = useTaskContext();

  if (!verifyUser(user)) {
    console.log('user undefined');
    router.replace('/auth');
    return;
  }

  if (!verifyHousehold(householdId)) {
    console.log('household undefined');
    router.replace('/household');
    return;
  }

  const disableAddButton =
    title === '' ||
    description === '' ||
    isLoading ||
    points === undefined ||
    assignee === undefined;

  const clearStates = () => {
    setTitle('');
    setDescription('');
    setPoints(5);
    setAssignee('');
  };

  const handleAddButton = async () => {
    setLoading(true);
    const task: TaskWithoutId = {
      title,
      description,
      points: points === undefined ? customPoints : points,
      assignee,
      status: assignee ? TaskStatus.ASSIGNED : TaskStatus.UNASSIGNED,
      creator: user.id,
      createdAt: new Date(Date.now()),
      submissionPhoto: ''
    };
    const taskId = await createTask(task, householdId);
    dispatch({ type: TaskActionType.ADD, task: { ...task, id: taskId } });
    setLoading(false);
    clearStates();
    setModalVisible(!isModalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(!isModalVisible)}>
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(false);
        }}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  ...styles.modalView,
                  backgroundColor:
                    actions === KSAction.KUDOS ? Colors.lightGreen : Colors.pink
                }}>
                <Text style={styles.header}>Type:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.pickerContainer}
                    selectedValue={actions}
                    onValueChange={(itemValue) => setActions(itemValue)}>
                    <Picker.Item label="Kudos" value={KSAction.KUDOS} />
                    <Picker.Item label="Slobs" value={KSAction.SLOBS} />
                  </Picker>
                </View>

                <Text style={styles.header}>Title:</Text>
                <TextInput
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  style={styles.input}
                />

                <Text style={styles.header}>Description:</Text>
                <TextInput
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.header}>
                  {actions === KSAction.KUDOS ? 'Add' : 'Remove'} how many
                  points:
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={points}
                    onValueChange={(itemValue) => setPoints(itemValue)}>
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="5" value={5} />
                    <Picker.Item label="10" value={10} />
                    <Picker.Item label="15" value={15} />
                    <Picker.Item label="Custom" value={undefined} />
                  </Picker>
                </View>

                {points === undefined && (
                  <TextInput
                    placeholder="Enter points"
                    keyboardType="numeric"
                    value={`${customPoints}`}
                    onChangeText={(text) => {
                      setCustomPoints(Number(text));
                    }}
                    style={styles.input}
                  />
                )}

                <Text style={styles.header}>
                  {'Award ' + actions.toLowerCase() + ' to:'}
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={assignee}
                    onValueChange={(itemValue) => setAssignee(itemValue)}>
                    <Picker.Item label="Unassigned" value={undefined} />
                    {householdMembers.map((member) => (
                      <Picker.Item
                        key={member.displayName}
                        label={member.displayName}
                        value={member.id}
                      />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { opacity: disableAddButton ? 0.5 : 1 }
                  ]}
                  disabled={disableAddButton}
                  onPress={handleAddButton}>
                  {!isLoading ? (
                    <Text style={styles.mediumText}>Submit</Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}>
                  {!isLoading ? (
                    <Text style={styles.mediumText}>Cancel</Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Spacers.medium
  },
  header: {
    paddingLeft: Spacers.small,
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 0,
    marginTop: Spacers.medium
  },
  modalView: {
    margin: Spacers.medium,
    backgroundColor: Colors.white,
    borderRadius: Style.largeRadius,
    padding: Spacers.large,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    backgroundColor: Colors.yellow,
    marginTop: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius,
    fontSize: Fonts.large
  },
  buttonCancel: {
    backgroundColor: Colors.lightGrey
  },
  mediumText: {
    fontSize: Fonts.medium
  },
  input: {
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    borderRadius: Style.radius,
    padding: Spacers.small,
    fontSize: Fonts.small,
    marginVertical: Spacers.small,
    backgroundColor: Colors.white
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: Style.radius,
    overflow: 'hidden'
  }
});
