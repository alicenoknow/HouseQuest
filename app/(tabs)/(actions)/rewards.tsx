import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  GestureResponderEvent
} from 'react-native';
import Colors from '../../../constants/Colors';
import { Reward, RewardStatus } from '../../../models';
import { useRewardsContext, RewardsActionType } from '../../../contexts';
import { createReward, updateRewardStatus } from '../../../remote/db';
import { useUserContext } from '../../../contexts';
import { User } from '../../../models';
import { Alert } from 'react-native';

// Componente do Modal de Detalhes da Reward
const RewardDetailsModal: React.FC<{ reward: Reward; onClose: () => void }> = ({
  reward,
  onClose
}) => {
  const { state: userState } = useUserContext();
  const { user } = userState;
  const [currentPoints] = useState(5);
  const { state, dispatch } = useRewardsContext();

  const handleUpdateRewardStatus = async (
    rewardId: string,
    newStatus: RewardStatus
  ) => {
    try {
      // Update the status in Firebase
      await updateRewardStatus(rewardId, newStatus);

      // Dispatch the action to update the app state
      dispatch({ type: RewardsActionType.REQUEST, id: rewardId });

      // Optionally, you can refresh the data from Firebase and update the app state
      // based on the latest data to ensure consistency.
      // Example:
      // const updatedReward = await fetchReward(rewardId);
      // dispatch({ type: RewardsActionType.REQUEST, reward: updatedReward });
    } catch (error) {
      console.error('Error updating reward status:', error);
    }
  };

  const handleRequestReward = async () => {
    try {
      if (reward.points <= currentPoints) {
        // Update the status in Firebase
        await updateRewardStatus(reward.id, RewardStatus.REQUESTED);

        // Dispatch the action to update the app state
        dispatch({ type: RewardsActionType.REQUEST, id: reward.id });
        onClose();
      } else {
        Alert.alert(
          'Insufficient Points',
          'You do not have enough points to request this reward.'
        );
      }
    } catch (error) {
      console.error('Error requesting reward:', error);
    }
  };

  // const handleGrantReward = () => {
  //   dispatch({ type: RewardsActionType.ACCEPT, id: reward.id });
  //   onClose();
  // };
  const handleGrantReward = () => {
    handleUpdateRewardStatus(reward.id, RewardStatus.GRANTED);
    dispatch({ type: RewardsActionType.ACCEPT, id: reward.id });
    onClose();
  };

  // const handleDeclineReward = async () => {
  //   dispatch({ type: RewardsActionType.DECLINE_REQUEST, id: reward.id });

  //   onClose();
  // };
  const handleDeclineReward = async () => {
    handleUpdateRewardStatus(reward.id, RewardStatus.AVAILABLE);
    dispatch({ type: RewardsActionType.DECLINE_REQUEST, id: reward.id });
    onClose();
  };

  const handleRemoveReward = () => {
    // You should add a confirmation prompt before removing the reward
    Alert.alert(
      'Remove Reward',
      'Are you sure you want to remove this reward?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: () => {
            dispatch({ type: RewardsActionType.REMOVE, id: reward.id });
            onClose();
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <Modal visible={reward !== null} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: 'black' }}>X</Text>
          </TouchableOpacity>
          {reward && (
            <View>
              <Text>Title: {reward.title}</Text>
              <Text>Description: {reward.description}</Text>
              {reward.points && <Text>Points: {reward.points}</Text>}
              <Text>Creator: {reward.creator}</Text>
              <Text>Status: {RewardStatus[reward.status]}</Text>

              {/* Ações com base no status da recompensa */}
              {reward.status === RewardStatus.AVAILABLE && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.greenButton]}
                    onPress={handleRequestReward}>
                    <Text style={{ color: 'black' }}>Request Reward</Text>
                  </TouchableOpacity>
                </View>
              )}

              {reward.status === RewardStatus.REQUESTED && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.greenButton]}
                    onPress={handleGrantReward}>
                    <Text style={{ color: 'black' }}>Grant Reward</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.redButton]}
                    onPress={handleDeclineReward}>
                    <Text style={{ color: 'black' }}>Decline Request</Text>
                  </TouchableOpacity>
                </View>
              )}

              {reward.creator === userState.user?.id &&
                reward.status !== RewardStatus.GRANTED && (
                  <Button title="Remove Reward" onPress={handleRemoveReward} />
                )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Componente do Item da Reward
const RewardItem: React.FC<{ item: Reward; onPress: () => void }> = ({
  item,
  onPress
}) => {
  let backgroundColor = Colors.defaultColor;

  switch (item.status) {
    case RewardStatus.AVAILABLE:
      backgroundColor = Colors.lightGreen;
      break;
    case RewardStatus.REQUESTED:
      backgroundColor = Colors.pink;
      break;
    // You may handle other statuses if needed
    default:
      break;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.rewardItem, { backgroundColor }]}>
        <Text>Title: {item.title}</Text>
        <Text>Description: {item.description}</Text>
        {item.points && <Text>Points: {item.points}</Text>}
        <Text>Creator: {item.creator}</Text>
        <Text>Status: {RewardStatus[item.status]}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Componente principal de Rewards
const Rewards: React.FC = () => {
  const { state: userState } = useUserContext();
  const { householdId } = userState;
  const { state, dispatch } = useRewardsContext();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [data, setData] = useState<Reward[]>([]);

  useEffect(() => {
    setData([...state.rewards]);
  }, [state]);

  // State para a nova Reward sendo criada
  const [newReward, setNewReward] = useState<Reward>({
    id: '',
    title: '',
    description: '',
    createdAt: new Date(),
    creator: '',
    recipient: '',
    status: RewardStatus.AVAILABLE,
    points: 0
  });

  const handleRewardPress = (item: Reward) => {
    setSelectedReward(item);
  };

  const handleCreateModalOpen = () => {
    setCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalVisible(false);
  };

  const handleAddReward = async () => {
    try {
      if (!householdId || !userState.user?.id) {
        return;
      }

      // Set the creator field with the user's ID
      const newRewardWithCreator = {
        ...newReward,
        creator: userState.user.displayName
      };

      const newRewardId = await createReward(newRewardWithCreator, householdId);

      dispatch({
        type: RewardsActionType.ADD,
        reward: { ...newRewardWithCreator, id: newRewardId }
      });

      handleCreateModalClose();
      setNewReward({
        id: '',
        title: '',
        description: '',
        createdAt: new Date(),
        creator: '',
        recipient: '',
        status: RewardStatus.AVAILABLE,
        points: 0
      });
    } catch (error) {
      console.error('Error adding reward:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <RewardItem item={item} onPress={() => handleRewardPress(item)} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal para Detalhes da Reward */}
      <RewardDetailsModal
        reward={selectedReward}
        onClose={() => setSelectedReward(null)}
      />

      {/* Modal para Criar Rewards */}
      <Modal visible={isCreateModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.inputField}
              placeholder="Reward Title"
              onChangeText={(text) =>
                setNewReward({ ...newReward, title: text })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Reward Description"
              onChangeText={(text) =>
                setNewReward({ ...newReward, description: text })
              }
            />
            <TextInput
              style={styles.inputField}
              placeholder="Points"
              keyboardType="numeric"
              onChangeText={(text) =>
                setNewReward({ ...newReward, points: parseInt(text, 10) || 0 })
              }
            />
            <Button
              title="Add"
              onPress={handleAddReward}
              style={styles.addButton}
            />
            <Button
              title="Cancel"
              onPress={handleCreateModalClose}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>

      {/* Botão para abrir o Modal de Criação de Reward */}
      <TouchableOpacity onPress={handleCreateModalOpen} style={styles.button}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
          Create Reward
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  rewardItem: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  button: {
    backgroundColor: Colors.darkGreen,
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    borderRadius: 15,
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '80%',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 15
  },

  inputField: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.darkGreen,
    borderRadius: 5
  },

  addButton: {
    backgroundColor: Colors.yellow,
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5
  },
  cancelButton: {
    backgroundColor: Colors.pink,
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5
  },
  // Add styles for the button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  // Add styles for the action buttons
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    color: 'black'
  },

  // Add styles for the green button
  greenButton: {
    backgroundColor: Colors.lightGreen
  },

  // Add styles for the red button
  redButton: {
    backgroundColor: Colors.pink
  }
});

export default Rewards;
