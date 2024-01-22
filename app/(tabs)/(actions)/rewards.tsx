import React, { useState, useContext } from 'react';
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
import { createReward } from '../../../remote/db';
import { useUserContext } from '../../../contexts';
import { User } from '../../../models/user';

// Componente do Modal de Detalhes da Reward
const RewardDetailsModal: React.FC<{ reward: Reward; onClose: () => void }> = ({
  reward,
  onClose
}) => {
  const { state: userState } = useUserContext();
  const { currentPoints } = User;

  const handleRequestReward = () => {
    // Lógica para solicitar a recompensa
    if (reward.points <= currentPoints) {
      // Realize a lógica para solicitar a recompensa
    } else {
      // O usuário não tem pontos suficientes, pode exibir uma mensagem ou lidar de outra forma
    }
  };

  const handleGrantReward = () => {
    // Lógica para conceder a recompensa
  };

  const handleDeclineReward = () => {
    // Lógica para recusar a solicitação de recompensa e mudar o status para disponível novamente
  };

  const handleRemoveReward = () => {
    // Lógica para remover a recompensa
  };

  return (
    <Modal visible={reward !== null} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {reward && (
            <View>
              <Text>Title: {reward.title}</Text>
              <Text>Description: {reward.description}</Text>
              {reward.points && <Text>Points: {reward.points}</Text>}
              <Text>Creator: {reward.creator}</Text>
              <Text>Status: {RewardStatus[reward.status]}</Text>

              {/* Ações com base no status da recompensa */}
              {reward.status === RewardStatus.AVAILABLE && (
                <Button
                  title="Request Reward"
                  onPress={handleRequestReward}
                  disabled={reward.points > points}
                />
              )}

              {reward.status === RewardStatus.REQUESTED && (
                <View>
                  <Button title="Grant Reward" onPress={handleGrantReward} />
                  <Button
                    title="Decline Request"
                    onPress={handleDeclineReward}
                  />
                </View>
              )}

              {reward.creator === user &&
                reward.status !== RewardStatus.GRANTED && (
                  <Button title="Remove Reward" onPress={handleRemoveReward} />
                )}

              <Button title="Close" onPress={onClose} />
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
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rewardItem}>
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
      if (!householdId) {
        return;
      }
      const newRewardId = await createReward(newReward, householdId); // Substitua 'householdId' pelo ID da casa apropriado

      dispatch({
        type: RewardsActionType.ADD,
        reward: { ...newReward, id: newRewardId }
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
      console.error('Erro ao adicionar Reward:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={state.rewards}
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
              placeholder="Reward Title"
              onChangeText={(text) =>
                setNewReward({ ...newReward, title: text })
              }
            />
            <TextInput
              placeholder="Reward Description"
              onChangeText={(text) =>
                setNewReward({ ...newReward, description: text })
              }
            />
            <TextInput
              placeholder="Points"
              keyboardType="numeric"
              onChangeText={(text) =>
                setNewReward({ ...newReward, points: parseInt(text, 10) || 0 })
              }
            />
            <Button title="Add" onPress={handleAddReward} />
            <Button title="Cancel" onPress={handleCreateModalClose} />
          </View>
        </View>
      </Modal>

      {/* Botão para abrir o Modal de Criação de Reward */}
      <TouchableOpacity onPress={handleCreateModalOpen} style={styles.button}>
        <Text>Create Reward</Text>
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
    borderColor: Colors.darkGreen,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15
  },
  button: {
    backgroundColor: Colors.yellow,
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5
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
    width: '80%'
  }
});

export default Rewards;
