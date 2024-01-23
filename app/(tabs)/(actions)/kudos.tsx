import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { KudosOrSlobs, KSAction, Role } from '../../../models';
import Colors from '../../../constants/Colors';
import { useKudosOrSlobsContext, useUserContext } from '../../../contexts';
import { Fonts, Spacers, Style } from '../../../constants';
import AddFeedbackModal from '../../../components/actions/kudos/AddFeedbackModal';

// TODO refactor, basically rewrite, extract components, fix styling

const Kudos: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [kudosOrSlobs, setKudosOrSlobs] = useState<KudosOrSlobs[]>([]);
  const { state: stateKudosOrSlobs } = useKudosOrSlobsContext();
  const { state: stateUser } = useUserContext();

  useEffect(() => {
    setKudosOrSlobs([...stateKudosOrSlobs.kudosOrSlobs]);
  }, [stateKudosOrSlobs]);

  const renderAvatar = (userId: string) => {
    const user = stateUser.householdMembers.find(
      (member) => member.id === userId
    );
    return user ? (
      <Image source={{ uri: user.photoURL }} style={styles.avatar} />
    ) : (
      <View style={styles.avatar} /> // Placeholder for missing avatar
    );
  };

  const formatDate = (timestamp: Date) => {
    return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
  };

  const renderItem = ({ item }: { item: KudosOrSlobs }) => {
    const senderName =
      stateUser.householdMembers.find((member) => member.id === item.sender)
        ?.displayName || 'Unknown';
    const receiverName =
      stateUser.householdMembers.find((member) => member.id === item.receiver)
        ?.displayName || 'Unknown';

    return (
      <View style={styles.item}>
        <View
          style={[
            styles.messageContainer,
            {
              borderColor:
                item.type === KSAction.KUDOS ? Colors.lightGreen : Colors.pink,
              backgroundColor:
                item.type === KSAction.KUDOS ? Colors.lightGreen : Colors.pink
            }
          ]}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.messageText}>{item.message}</Text>
            {item.points !== null && item.points !== undefined && (
              <Text style={styles.points}>Points: {String(item.points)}</Text>
            )}
            <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.userContainer}>
          {renderAvatar(item.sender)}
          <Text style={styles.userName}>{senderName}</Text>
          <Text> to </Text>
          {renderAvatar(item.receiver)}
          <Text style={styles.userName}>{receiverName}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={kudosOrSlobs}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
      {stateUser.user?.role !== Role.CHILD && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Give Feedback</Text>
        </TouchableOpacity>
      )}
      <AddFeedbackModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },

  messageContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatars: {
    flexDirection: 'row',
    marginRight: 10,
    marginLeft: 10
  },
  avatar: {
    backgroundColor: 'lightgray',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    marginLeft: 5
  },
  points: {
    marginTop: 5,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: Colors.darkGreen,
    margin: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.radius
  },
  buttonText: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    color: Colors.white
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.medium,
    elevation: 2,
    marginTop: 15
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  messageText: {
    fontSize: Fonts.medium,
    marginBottom: 5
  },
  timestamp: {
    fontSize: Fonts.small,
    fontStyle: 'italic',
    alignSelf: 'flex-end'
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  userName: {
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 'bold',
    flexShrink: 1
  }
});

export default Kudos;
