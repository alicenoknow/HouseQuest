import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Colors from '../../../constants/Colors';
import { Reward, RewardStatus } from '../../../models';
import { useRewardsContext, RewardsActionType } from '../../../contexts';
import {
  createReward,
  removeReward,
  updateRewardStatus
} from '../../../remote/db';
import { useUserContext } from '../../../contexts';
import { Alert } from 'react-native';
import Fonts from '../../../constants/Fonts';
import Spacers from '../../../constants/Spacers';


// Componente do Modal de Detalhes da Reward
const RewardDetailsModal: React.FC<{ reward: Reward; onClose: () => void }> = ({
  reward,
  onClose
}) => {
  const { state: userState } = useUserContext();
  const [currentPoints] = useState(5);
  const { dispatch } = useRewardsContext();
  const { householdId } = userState;

  const handleRequestReward = async () => {
    try {
      if (reward.points <= currentPoints) {
        await updateRewardStatus(reward.id, RewardStatus.REQUESTED);
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

  const handleGrantReward = async () => {
    await updateRewardStatus(reward.id, RewardStatus.GRANTED);
    dispatch({ type: RewardsActionType.ACCEPT, id: reward.id });
    onClose();
  };

  const handleDeclineReward = async () => {
    await updateRewardStatus(reward.id, RewardStatus.AVAILABLE);
    dispatch({ type: RewardsActionType.DECLINE_REQUEST, id: reward.id });
    onClose();
  };

  const handleRemoveReward = async () => {
    try {
      if (!reward || !householdId) {
        return;
      }

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
            onPress: async () => {
              // Remove the reward from Firebase
              await removeReward(reward.id, householdId);

              // Dispatch the action to update the app state
              dispatch({
                type: RewardsActionType.REMOVE,
                id: reward.id
              });

              // Close the modal
              onClose();
            },
            style: 'destructive'
          }
        ]
      );
    } catch (error) {
      console.error('Error removing reward:', error);
    }
  };

  return (
    <Modal visible={reward !== null} transparent animationType="slide">
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                {!!reward && (
                  <View>
                    <Text style={styles.detail}>Title: {reward.title}</Text>
                    <Text style={styles.detail}>
                      Description: {reward.description}
                    </Text>
                    {!!reward.points && (
                      <Text style={styles.detail}>Points: {reward.points}</Text>
                    )}
                    <Text style={styles.detail}>Creator: {reward.creator}</Text>
                    <Text style={styles.detail}>
                      Status: {RewardStatus[reward.status]}
                    </Text>
                    {reward.creator === userState.user?.displayName &&
                      reward.status !== RewardStatus.GRANTED && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={handleRemoveReward}>
                          <Text
                            style={{ color: 'black', fontSize: Fonts.medium }}>
                            Remove Reward
                          </Text>
                        </TouchableOpacity>
                        // <Button title="Remove Reward" onPress={handleRemoveReward}  />
                      )}
                    {/* Ações com base no status da recompensa */}
                    {reward.status === RewardStatus.AVAILABLE && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.greenButton]}
                          onPress={handleRequestReward}>
                          <Text
                            style={{ color: 'black', fontSize: Fonts.medium }}>
                            Request Reward
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {reward.status === RewardStatus.REQUESTED && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.greenButton]}
                          onPress={handleGrantReward}>
                          <Text
                            style={{ color: 'black', fontSize: Fonts.medium }}>
                            Grant Reward
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.redButton]}
                          onPress={handleDeclineReward}>
                          <Text
                            style={{ color: 'black', fontSize: Fonts.medium }}>
                            Decline Request
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.redButton]}
                        onPress={() => {
                          onClose();
                        }}>
                        <Text
                          style={{ color: 'black', fontSize: Fonts.medium }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Componente do Item da Reward
const RewardItem: React.FC<{ item: Reward; onPress: () => void }> = ({
  item,
  onPress
}) => {
  let backgroundColor = Colors.lightGrey;

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
    <TouchableOpacity onPress={() => onPress()}>
      <View style={[styles.rewardItem, { backgroundColor }]}>
        {!!item.points && (
          <View style={styles.circleContainer}>
            <Text style={styles.circleText}>{item.points}</Text>
          </View>
        )}

        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>{item.title}</Text>
          <Text>{RewardStatus[item.status]}</Text>
        </View>
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
    const sortedData = [...state.rewards].sort((a: Reward, b: Reward) => {
      const statusOrder: { [key in RewardStatus]: number } = {
        [RewardStatus.GRANTED]: 3,
        [RewardStatus.AVAILABLE]: 1,
        [RewardStatus.REQUESTED]: 2
      };

      return statusOrder[a.status] - statusOrder[b.status];
    });

    setData(sortedData);
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
      {!!selectedReward && (
        <RewardDetailsModal
          reward={selectedReward}
          onClose={() => setSelectedReward(null)}
        />
      )}

      {/* Modal para Criar Rewards */}
      <Modal visible={isCreateModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback
          onPress={() => {
            setCreateModalVisible(false);
          }}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white">
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => { }}>
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
                      setNewReward({
                        ...newReward,
                        points: Math.abs(parseInt(text, 10) || 0)
                      })
                    }
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.greenButton]}
                      onPress={handleAddReward}>
                      <Text style={{ color: 'black', fontSize: Fonts.medium }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.redButton]}
                      onPress={handleCreateModalClose}>
                      <Text style={{ color: 'black', fontSize: Fonts.medium }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                style={[styles.actionButton, styles.redButton]}
                onPress={handleCreateModalClose}>
                <Text style={{ color: 'black' }}>Cancel</Text>
              </TouchableOpacity> */}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
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
    flexDirection: 'row', // Para alinhar o círculo e o conteúdo na horizontal
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
  circleContainer: {
    width: 50, // Ajuste conforme necessário
    height: 50, // Ajuste conforme necessário
    borderRadius: 100, // Para torná-lo circular
    backgroundColor: Colors.white, // Cor do círculo
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10 // Espaçamento entre o círculo e o conteúdo
  },
  circleText: {
    fontWeight: 'bold',
    color: 'black'
  },
  rewardContent: {
    flex: 1 // Para o conteúdo ocupar o restante do espaço disponível na horizontal
  },
  rewardTitle: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    marginBottom: Spacers.small
  },
  rewardDescription: {
    fontSize: 14
  },
  rewardPoints: {
    fontSize: 16
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
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.darkGreen,
    borderRadius: 12
  },

  detail: {
    borderRadius: 12,
    fontWeight: 'bold'
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

  removeButton: {
    backgroundColor: Colors.pink,
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    color: 'black'
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
