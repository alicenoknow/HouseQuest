import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Task, TaskStatus } from '../../../models';
import { TaskActionType, useTaskContext, useUserContext } from '../../../contexts';
import Spacers from '../../../constants/Spacers';
import Fonts from '../../../constants/Fonts';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Icon from '../../common/Icon';
import { removeTask, updateTask } from '../../../remote/db';

// TODO zduplikowane taski po zmianie statusu

interface TaskDetailsModalProps {
  task: Task;
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
}

const TaskDetailsModal = ({ task, isModalVisible, setModalVisible }: TaskDetailsModalProps) => {
  const { state: { user, householdId, householdMembers } } = useUserContext();
  const { dispatch } = useTaskContext();

  if (user == undefined || householdId == undefined) {
    return null;
  }

  const { title, description, status, points, creator, assignee, submissionPhoto } = task;
  const showAssignButton = status === TaskStatus.UNASSIGNED;
  const showSubmitButton = status === TaskStatus.ASSIGNED && assignee === user.id;
  const showDeclineConfirmButtons = status === TaskStatus.SUBMITTED && creator === user.id;
  const showRemoveButton = creator === user.id;

  const getDisplayName = (id: string) => {
    return householdMembers?.filter(member => member.id === id)?.at(0)?.displayName ?? '';
  }

  const onAssign = async () => {
    const updatedTask = { ...task, status: TaskStatus.ASSIGNED, assignee: user.id };
    dispatch({ type: TaskActionType.ASSIGN, id: task.id, user: user.id });
    await updateTask(updatedTask);
    setModalVisible(false);
  };

  const onSubmit = async () => {
    const timestamp = new Date(Date.now());
    const updatedTask = { ...task, status: TaskStatus.SUBMITTED, submissionPhoto: "", submittedAt: timestamp };
    dispatch({ type: TaskActionType.SUBMIT, id: task.id, submissionPhoto: "", submittedAt: timestamp });
    await updateTask(updatedTask);
    setModalVisible(false);
  };

  const onDecline = async () => {
    const updatedTask = { ...task, status: TaskStatus.ASSIGNED };
    dispatch({ type: TaskActionType.DECLINE, id: task.id });
    await updateTask(updatedTask);
    setModalVisible(false);
  };

  const onConfirm = async () => {
    const updatedTask = { ...task, status: TaskStatus.CONFIRMED };
    dispatch({ type: TaskActionType.CONFIRM, id: task.id });
    await updateTask(updatedTask);
    setModalVisible(false);
  };


  const onRemove = async () => {
    dispatch({ type: TaskActionType.REMOVE, id: task.id });
    await removeTask(task.id, householdId);
    setModalVisible(false);
  };

  const renderTopRow = () => (
    <View style={styles.topRow}>
      <View style={styles.circle}>
        <Text style={styles.pointsText}>{`🔥${points}` ?? '🛠'}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Icon name="close-outline" size={Fonts.large} color={Colors.black} />
      </TouchableOpacity>
    </View>)

  const renderContent = () => (
    <View style={styles.content}>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.contentText}>{`Status: ${status}`}</Text>
      <Text style={styles.contentText}>{`Creator: ${getDisplayName(creator)}`}</Text>
      <Text style={styles.contentText}>{`Assignee: ${assignee ? getDisplayName(assignee) : 'Unassigned'}`}</Text>
      {submissionPhoto ? <Image style={styles.image} source={{ uri: submissionPhoto }} /> : null}
    </View>
  )

  const renderButtons = () => (
    <>
      {showAssignButton && (
        <TouchableOpacity style={styles.button} onPress={onAssign}>
          <Text style={styles.buttonText}>Assign me</Text>
        </TouchableOpacity>
      )}
      {showSubmitButton && (
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Submit task</Text>
        </TouchableOpacity>
      )}
      {showDeclineConfirmButtons && (
        <>
          <TouchableOpacity style={styles.button} onPress={onDecline}>
            <Text style={styles.buttonText}>Decline submission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirm task</Text>
          </TouchableOpacity>
        </>
      )}
      {showRemoveButton && (
        <TouchableOpacity style={styles.button} onPress={onRemove}>
          <Text style={styles.buttonText}>Remove task</Text>
        </TouchableOpacity>
      )}
    </>
  )

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(!isModalVisible)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderTopRow()}
          {renderContent()}
          {renderButtons()}
        </View>
      </View>
    </Modal >
  )
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginRight: Spacers.medium,
  },
  circle: {
    width: 90,
    height: 60,
    borderRadius: Style.xLargeRadius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    padding: Spacers.small,
  },
  pointsText: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
  },
  content: {
    marginHorizontal: Spacers.medium,
    marginVertical: Spacers.small,
  },
  title: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    marginBottom: Spacers.small,
  },
  description: {
    fontSize: Fonts.medium,
    marginBottom: Spacers.small,
  },
  contentText: {
    fontSize: Fonts.medium,
    color: Colors.darkGrey,
    marginBottom: Spacers.small,
  },
  button: {
    backgroundColor: Colors.yellow,
    marginTop: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius,
    fontSize: Fonts.large,
  },
  buttonText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: Fonts.medium,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: Style.radius,
    marginTop: Spacers.small,
  }
});

export default TaskDetailsModal;
