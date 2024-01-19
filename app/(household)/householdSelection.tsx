//create a view for the user to select their household
//

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { db } from '../../config';
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
  addDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { firebaseUser } from '../../models/firebaseUser';
import { User } from '../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HouseholdInvite from './householdInviteCard';
import { router } from 'expo-router';

type HouseholdSelectionProps = {
  invites: any[]; // replace any[] with the actual type if known
};

const HouseholdSelection: React.FC<HouseholdSelectionProps> = ({ invites }) => {
  const [user, setUser] = React.useState<firebaseUser | undefined>(undefined);
  const [household, setHousehold] = React.useState<string | undefined>(
    undefined
  );
  const [householdInput, setHouseholdInput] = React.useState<string>('');
  const [inviteHouseholds, setInviteHouseholds] = React.useState<any[]>([]);

  const getUser = async () => {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
      router.replace('/auth');
      return;
    }
    const userJson = JSON.parse(user);
    setUser(userJson);
  };

  const getHousehold = async () => {
    const household = await AsyncStorage.getItem('@household');
    if (household) {
      setHousehold(household);
    }
  };

  useEffect(() => {
    getUser();
    getHousehold();
  }, []);

  useEffect(() => {
    console.log('Invites updated in HouseholdSelection', invites);
    setInviteHouseholds(invites);
  }, [invites]);

  useEffect(() => {
    console.log('Household updated in HouseholdSelection', household);
    if (household) {
      AsyncStorage.setItem('@household', household);
      router.replace('/index');
    }
  }, [household]);

  const getUserData = async () => {
    if (!user) {
      console.log('No user found!');
      router.replace('/auth');
      return;
    }
    const userRef = doc(db, 'users', user?.uid);
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

  const createHousehold = async (
    userValue: firebaseUser | undefined,
    householdValue: string | undefined
  ) => {
    if (!userValue) {
      console.log('No user found!');
      return;
    }
    if (!householdValue) {
      console.log('No household name provided!');
      return;
    }
    // Create household document in the 'households' collection
    const householdRef = doc(collection(db, 'households'));
    await setDoc(householdRef, {
      name: householdValue,
      owner: userValue.uid,
      members: [userValue.uid],
      tasks: [],
      rewards: [],
      todos: [],
      announcements: [],
      kudos: []
    });
    console.log('Household created with ID:', householdRef.id);

    // Update user with household ID
    const userRef = doc(db, 'users', userValue.uid);
    await updateDoc(userRef, {
      household: householdRef.id
    });
    console.log('User updated with household ID');
    await AsyncStorage.setItem('@household', householdRef.id);
  };

  return (
    <View style={styles.container}>
      {household ? (
        <Text>Household: {household}</Text>
      ) : (
        <>
          <Text>No household associated with the user.</Text>
          <Text>Invites:</Text>
          {inviteHouseholds.length > 0 ? (
            inviteHouseholds.map((invite, index) => (
              <HouseholdInvite
                key={index}
                householdName={invite}
                onPress={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            ))
          ) : (
            <Text>No invites available.</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter household name"
            onChangeText={(text) => setHouseholdInput(text)}
            defaultValue={householdInput}
          />
          <Button
            title="Create Household"
            onPress={() => createHousehold(user, householdInput)}
          />
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
