import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Announcement, Role, User } from '../../models';
import Spacers from '../../constants/Spacers';
import Style from '../../constants/Style';
import { Text } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config';
import { Ionicons } from '@expo/vector-icons';

// TODO refactor, basically rewrite, extract components, fix styling
import { useUserContext } from '../../contexts/UserContext';
import ImagePickerButton from '../../components/ImagePickerButton';
import { createAnnouncement, fetchAnnouncements } from '../../remote/db';
import { uploadImageToFirebase } from '../../remote/storage';
import { useAnnouncementContext, AnnouncementActionType } from '../../contexts';
import Icon from '../../components/common/Icon';

async function addAnnouncement(
  announcementText: string,
  user: User,
  householdId: string,
  imageUri?: string
) {
  if (!user || !householdId) {
    throw new Error('User or household ID is not defined');
  }

  let photoUrl = '';

  // Check if an image URI is provided and upload the image
  if (imageUri) {
    const imageName = `announcement_${Date.now()}`; // Generate a unique image name
    const imageDir = `households/${householdId}/announcements`; // Define the directory path
    photoUrl = await uploadImageToFirebase(imageUri, imageName, imageDir);
  }

  const announcement: Announcement = {
    id: Date.now().toString(),
    sender: user.id,
    createdAt: new Date(),
    content: announcementText,
    photoUri: photoUrl
  };

  await createAnnouncement(announcement, householdId);
}

const Dashboard: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [resetImagePicker, setResetImagePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined
  );
  const { state, dispatch } = useUserContext();
  const { householdMembers } = state;
  const { state: announcementState, dispatch: announcementDispatch } =
    useAnnouncementContext();
  const isButtonDisabled = !announcement.trim() || isSending;
  const usersList = householdMembers.length > 0 ? householdMembers : [];
  const flatListRef = React.useRef<FlatList<Announcement>>(null);
  const [reversedAnnouncements, setReversedAnnouncements] = useState<
    Announcement[]
  >([]);

  const handleSendAnnouncement = async () => {
    const { user, householdId } = state;
    if (user && householdId) {
      setIsSending(true);
      try {
        await addAnnouncement(announcement, user, householdId, selectedImageUri)
          .then(() => {
            announcementDispatch({
              type: AnnouncementActionType.ADD,
              announcement: {
                id: Date.now().toString(),
                sender: user.id,
                createdAt: new Date(),
                content: announcement,
                photoUri: selectedImageUri
              }
            });
            setAnnouncement('');
            setSelectedImageUri(undefined);
            setResetImagePicker(true);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      } finally {
        setIsSending(false);
      }
    } else {
      console.log('User or household ID is not defined');
    }
  };

  const renderItem = ({ item }: { item: Announcement }) => (
    <AnnouncementItem item={item} />
  );

  const AnnouncementItem = React.memo(({ item }: { item: Announcement }) => {
    return (
      <View
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: Colors.lightGreen,
          borderRadius: Style.radius
        }}>
        <View style={styles.announcementContainer}>
          {usersList.find((user) => user.id === item.sender)?.photoURL ? (
            <>
              <Image
                source={{
                  uri: usersList.find((user) => user.id === item.sender)
                    ?.photoURL
                }}
                style={styles.avatar}
              />
              <Text style={styles.announcementHeader}>
                {usersList.find((user) => user.id === item.sender)?.displayName}
              </Text>
            </>
          ) : (
            <>
              <Icon name="person" color="white" />
              <Text style={styles.announcementHeader}>Unkown User</Text>
            </>
          )}
          <Text style={styles.announcementHeaderTime}>
            {item.createdAt.getHours() +
              ':' +
              //make sure minutes are always 2 digits
              (item.createdAt.getMinutes() < 10
                ? '0' + item.createdAt.getMinutes()
                : item.createdAt.getMinutes()) +
              ' - ' +
              item.createdAt.getDate().toLocaleString() +
              '/' +
              (item.createdAt.getMonth() + 1).toLocaleString()}
          </Text>
        </View>
        <View style={styles.announcementContainer}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
        {item.photoUri ? (
          <Image
            source={{ uri: item.photoUri }}
            style={styles.annoucementPhoto}
          />
        ) : null}
      </View>
    );
  });

  const renderUserAvatar = ({ item }: { item: User }) => {
    return (
      <Link
        href={`/users/${item.id}`}
        style={{
          borderRadius: 15,
          marginLeft: 5,
          padding: 2,
          backgroundColor:
            item.role == Role.CHILD ? Colors.pink : Colors.lightGreen,
          justifyContent: 'center', // Center the child vertically
          alignItems: 'center'
        }}
        asChild>
        <TouchableOpacity
          style={[
            styles.userAvatar,
            {
              backgroundColor:
                item.role == Role.CHILD ? Colors.pink : Colors.lightGreen
            }
          ]}
          onPress={() =>
            console.log(`User avatar pressed ${item.displayName}`)
          }>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
          ) : (
            <Icon name="person" color="white" />
          )}
        </TouchableOpacity>
      </Link>
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const householdId = state.householdId;
      if (!householdId) {
        throw new Error('Household ID is not defined');
      }

      const fetchAllAnnouncements = async () => {
        const announcementsArray: Announcement[] = [];
        await fetchAnnouncements(householdId, (announcement) => {
          announcementsArray.push(announcement);
        });
        return announcementsArray;
      };

      const newAnnouncements = await fetchAllAnnouncements();
      console.log('newAnnouncements', newAnnouncements);

      newAnnouncements.forEach((announcement) => {
        console.log('newAnnouncements', announcement);
        announcementDispatch({
          type: AnnouncementActionType.ADD,
          announcement: announcement
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [state.householdId, announcementDispatch]);

  useEffect(() => {
    if (resetImagePicker) {
      setResetImagePicker(false);
    }
  }, [resetImagePicker]);

  useEffect(() => {
    if (announcementState.announcements.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
    const reversedArray = [...announcementState.announcements].reverse();
    setReversedAnnouncements(reversedArray);
  }, [announcementState.announcements]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.title}>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.avatarContainer}>
          <FlatList
            horizontal
            data={usersList}
            renderItem={renderUserAvatar}
            keyExtractor={(item) => item.id}
            style={styles.userList}
          />
          <TouchableOpacity style={styles.addButton}>
            <Link href="/invite">
              <Ionicons name="add-circle-outline" size={40} color="white" />
            </Link>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>Announcements</Text>
      <View style={styles.line} />
      <View style={styles.messagesSection}>
        <FlatList
          inverted
          ref={flatListRef}
          style={styles.userList}
          data={reversedAnnouncements}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            onChangeText={(newText) => setAnnouncement(newText)}
            defaultValue={announcement}
            editable={!isSending}
          />
          <ImagePickerButton
            onImageSelected={setSelectedImageUri}
            resetSelection={resetImagePicker}
          />
          {isSending ? (
            <ActivityIndicator size="large" color={Colors.darkGreen} />
          ) : (
            <TouchableOpacity
              onPress={async () => {
                await handleSendAnnouncement();
              }}
              disabled={isButtonDisabled}
              style={[
                styles.sendButton,
                { opacity: isButtonDisabled ? 0.6 : 1 }
              ]}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacers.xLarge
  },
  subtitle: {
    color: Colors.darkGreen,

    marginLeft: 10,
    marginTop: 30
  },
  messagesSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E8E8E8'
  },
  line: {
    width: '40%',
    height: 0.6,
    backgroundColor: Colors.darkGreen,
    marginTop: 0
  },
  avatarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGreen,
    borderRadius: 50,
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 10, // Adjust padding as needed
    marginLeft: 60,
    marginRight: 60
  },
  addButton: {
    // Style for your add button, adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  announcementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  userAvatar: {
    borderRadius: 100,
    padding: 5,
    margin: 5,
    height: 40,
    marginTop: -3
  },

  annoucementPhoto: {
    height: 220,
    width: 220,
    marginLeft: 10,
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    height: 35
  },
  sendButton: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.small,
    paddingHorizontal: Spacers.medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonText: {
    color: Colors.white
  },
  announcementHeaderTime: {
    marginLeft: 10,
    fontStyle: 'italic',
    fontSize: 6
  },
  announcementHeader: {
    marginLeft: 10,
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  messageText: {
    marginLeft: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    margin: 0
  },
  userList: {
    padding: 10
  },
  announcementsList: {
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 80,
    marginTop: 10,
    marginBottom: 10
  },
  disabledButton: {
    paddingHorizontal: Spacers.medium,
    backgroundColor: '#cccccc' // A lighter shade to indicate disabled state
  }
});

export default Dashboard;
