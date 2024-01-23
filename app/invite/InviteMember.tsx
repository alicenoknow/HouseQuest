import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { Fonts, Spacers, Style } from '../../constants';
import Animated, { BounceIn, BounceInUp, BounceOutUp, FadeInUp } from 'react-native-reanimated';

const InviteScreen = () => {
  const [email, setEmail] = useState('');
  const [isSent, setSent] = useState(false);
  const [role, setRole] = useState('PARENT');
  const [senderId, setSenderId] = useState(null);
  const [householdId, setHouseholdId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    return () => setSent(false);
  }, []);

  const sendInvite = async () => {
    if (!senderId) {
      console.error('Sender ID is not available.');
      return;
    }

    setIsLoading(true);
    setSent(false);
    try {
      await addDoc(collection(db, 'invites'), {
        receiver_email: email,
        role: role,
        sender_id: senderId,
        household: householdId
      });
      console.log('Invite sent');
      setSent(true);
    } catch (error) {
      console.error('Error sending invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!senderId) return <ActivityIndicator size="large" />; // Show a loading spinner while fetching data

  return (
    <View style={styles.container}>
      <Text style={{
        fontSize: 22,
        marginVertical: Spacers.xLarge
      }}>Invite your family or friends! 👨‍👨‍👧‍👦</Text>
      {isSent ? <Animated.Text entering={BounceInUp} exiting={FadeInUp} style={[styles.buttonText, { color: Colors.darkGreen, marginBottom: Spacers.medium }]}> Invite sent 👍</Animated.Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.largerText}>Select Role</Text>
      <Picker
        style={styles.picker}
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}>
        <Picker.Item label="Parent" value="PARENT" />
        <Picker.Item label="Child" value="CHILD" />
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={sendInvite}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Invite</Text>
        )}
      </TouchableOpacity>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    padding: Spacers.medium,
    marginBottom: Spacers.medium,
    borderRadius: Style.radius,
    width: '100%',
    fontSize: Fonts.medium

  },
  largerText: {
    fontSize: Fonts.medium,
    marginBottom: Spacers.medium,
  },
  picker: {
    width: '100%',
    marginBottom: Spacers.medium,
    borderRadius: Style.radius,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: Colors.darkGreen,
    padding: 10,
    borderRadius: Style.radius,
    alignItems: 'center',
    width: '100%',
    marginTop: Spacers.xLarge
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.medium
  }
});

export default InviteScreen;
