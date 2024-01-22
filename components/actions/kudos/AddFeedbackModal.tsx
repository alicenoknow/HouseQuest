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
import { Spacers, Colors, Style, Fonts } from '../../../constants';
import { UserActionType, useUserContext } from '../../../contexts';
import { createKudosSlobs, updateUser } from '../../../remote/db';
import { verifyHousehold, verifyUser } from '../../../functions/verify';
import { router } from 'expo-router';
import {
  useKudosOrSlobsContext,
  KudosOrSlobsActionType
} from '../../../contexts';
import { KSAction, KudosOrSlobs } from '../../../models';
import { BlurView } from '@react-native-community/blur';

export default function AddFeedbackModal({
  isModalVisible,
  setModalVisible
}: {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
}) {
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(5);
  const [customPoints, setCustomPoints] = useState(0);
  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState<KSAction>(KSAction.KUDOS);
  const {
    state: { user, householdId, householdMembers },
    dispatch: dispatchUser
  } = useUserContext();
  const { state, dispatch } = useKudosOrSlobsContext();

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
    description === '' || isLoading || assignee === undefined;

  const clearStates = () => {
    setDescription('');
    setPoints(5);
    setAssignee(undefined);
    setCustomPoints(0);
  };

  const handleAddButton = async () => {
    setLoading(true);
    if (!assignee) {
      return;
    }
    const updatePoints = points ? points : customPoints;
    const adjustedUpdatePoints =
      actions === KSAction.KUDOS
        ? Math.abs(updatePoints)
        : -1 * Math.abs(updatePoints);

    const ks: KudosOrSlobs = {
      id: '',
      type: actions,
      sender: user.id,
      receiver: assignee,
      message: description,
      timestamp: new Date(),
      points: points === undefined ? customPoints : points
    };

    const ksId = await createKudosSlobs(ks, householdId);
    dispatch({
      type: KudosOrSlobsActionType.ADD,
      kudosOrSlobs: { ...ks, id: ksId }
    });

    if (assignee && updatePoints !== null && updatePoints !== undefined) {
      const assigneeUser = householdMembers
        .filter((m) => m.id === assignee)
        ?.at(0);
      if (assigneeUser) {
        let newCurrentPoints = Math.max(
          0,
          assigneeUser.currentPoints + adjustedUpdatePoints
        );

        const { currentPoints, totalPoints } = assigneeUser;
        const updatedMember = {
          ...assigneeUser,
          currentPoints: newCurrentPoints,
          totalPoints: Math.max(totalPoints, totalPoints + adjustedUpdatePoints)
        };
        dispatchUser({
          type: UserActionType.UPDATE_MEMBER,
          member: updatedMember
        });
        user.id == updatedMember.id &&
          dispatchUser({
            type: UserActionType.UPDATE_USER,
            user: updatedMember
          });
        await updateUser(updatedMember);
      }
    }
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
