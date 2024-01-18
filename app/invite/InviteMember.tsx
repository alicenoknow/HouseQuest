import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config'; // Import your Firestore configuration
import AsyncStorage from '@react-native-async-storage/async-storage';

const InviteScreen = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PARENT');
  const [senderId, setSenderId] = useState(null);
  const [householdId, setHouseholdId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('@user');
      if (user) {
        setSenderId(JSON.parse(user).uid);
      }
      const household = await AsyncStorage.getItem('@household');
      if (household) {
        setHouseholdId(household);
      }
    };

    fetchUser();
  }, []);

  const sendInvite = async () => {
    if (!senderId) {
      console.error('Sender ID is not available.');
      return;
    }

    try {
      await addDoc(collection(db, 'invites'), {
        receiver_email: email,
        role: role,
        sender_id: senderId,
        household_id: householdId
      });
      console.log('Invite sent');
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  if (!senderId) return null; // or a loading spinner

  return (
    <View>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}>
        <Picker.Item label="Parent" value="PARENT" />
        <Picker.Item label="Child" value="CHILD" />
      </Picker>
      <Button title="Send Invite" onPress={sendInvite} />
    </View>
  );
};

export default InviteScreen;
