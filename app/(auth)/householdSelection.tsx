//create a view for the user to select their household
//

import React from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { db } from '../../config';
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs
} from 'firebase/firestore';
import { User } from '../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HouseholdSelection: React.FC = () => {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [household, setHousehold] = React.useState<string | undefined>(
    undefined
  );
  const [inviteHouseholds, setInviteHouseholds] = React.useState<string[]>([]);

  const getUser = async () => {
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      const userJson = JSON.parse(user);
      setUser(userJson);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const getUserData = async () => {
    if (!user) {
      console.log('No user found!');
      return;
    }
    const userRef = doc(db, 'users', user?.id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('userSnap', userSnap.data());
      const userData = userSnap.data();
      if (userData?.household) {
        setHousehold(userData.household);
      } else {
        const inviteQuery = query(
          collection(db, 'invites'),
          where('email', '==', user?.email)
        );
        const inviteSnapshot = await getDocs(inviteQuery);
        const invites = inviteSnapshot.docs.map((doc) => doc.data().household);
        setInviteHouseholds(invites);
      }
    } else {
      console.log('No such document!');
    }
  };

  const createHousehold = async () => {
    // Implement your logic to create a household here
  };

  return (
    <View style={styles.container}>
      <Text>HouseholdSelection Component</Text>
      {household ? (
        <Text>Household: {household}</Text>
      ) : (
        <>
          <Text>No household associated with the user.</Text>
          <Text>Invites:</Text>
          {inviteHouseholds.map((inviteHousehold) => (
            <Text key={inviteHousehold}>{inviteHousehold}</Text>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Enter household name"
            onChangeText={(text) => setHousehold(text)}
          />
          <Button title="Create Household" onPress={createHousehold} />
        </>
      )}
      <Button title="Get User Data" onPress={getUserData} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10
  }
});

export default HouseholdSelection;
