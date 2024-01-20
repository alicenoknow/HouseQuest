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
import { User, Role } from '../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HouseholdInvite from './householdInviteCard';
import { router } from 'expo-router';
import { UserActionType, useUserContext } from '../../contexts/UserContext';

type HouseholdSelectionProps = {
  invites: any[]; // replace any[] with the actual type if known
  householdUpdate: boolean;
};

const HouseholdSelection: React.FC<HouseholdSelectionProps> = ({
  invites,
  householdUpdate
}) => {
  const [user, setUser] = React.useState<firebaseUser | undefined>(undefined);
  const [household, setHousehold] = React.useState<string | undefined>(
    undefined
  );
  const [householdInput, setHouseholdInput] = React.useState<string>('');
  const [inviteHouseholds, setInviteHouseholds] = React.useState<any[]>([]);
  const { dispatch } = useUserContext();

  const getUser = async () => {
    await AsyncStorage.getItem('@user').then((user) => {
      if (!user) {
        console.log('user_hselect1', user);
        router.replace('/auth');
        return;
      }
      const userJson = JSON.parse(user);
      setUser(userJson);
    });
  };

  const getHousehold = async () => {
    await AsyncStorage.getItem('@household').then((household) => {
      if (household) {
        setHousehold(household);
      }
    });
  };

  useEffect(() => {
    getUser();
    getHousehold();
  }, [householdUpdate]);

  useEffect(() => {
    console.log('Invites updated in HouseholdSelection', invites);
    setInviteHouseholds(invites);
  }, [invites]);

  useEffect(() => {
    console.log('Household updated in HouseholdSelection', household);
    if (household) {
      AsyncStorage.setItem('@household', household);
      dispatch({
        type: UserActionType.UPDATE_HOUSEHOLD,
        householdId: household
      });

      router.replace('(tabs)');
    }
  }, [household]);

  const getUserData = async () => {
    if (!user) {
      console.log('user_hselect2', user);
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
      household: householdRef.id,
      role: Role.PARENT
    });
    console.log('User updated with household ID', householdRef.id);
    await AsyncStorage.setItem('@household', householdRef.id);
    dispatch({
      type: UserActionType.UPDATE_HOUSEHOLD,
      householdId: householdRef.id
    });
    router.replace('(tabs)');
  };

  const joinHousehold = async (householdJoinId: string, inviteRole: string) => {
    if (!user) {
      console.log('No user found!');
      return;
    }
    if (!householdJoinId) {
      console.log('No household ID provided!');
      return;
    }
    if (!inviteRole) {
      console.log('No role provided!');
      return;
    }
    if (inviteRole !== Role.CHILD && inviteRole !== Role.PARENT) {
      console.log('Invalid role provided!');
      return;
    }

    // Update user with household ID
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      household: householdJoinId,
      role: inviteRole
    });

    // Update household with user ID
    const householdRef = doc(db, 'households', householdJoinId);
    const householdDoc = await getDoc(householdRef);
    if (householdDoc.exists()) {
      const householdData = householdDoc.data();
      const members = householdData.members || []; // default to an empty array if members is not defined
      await updateDoc(householdRef, {
        members: [...members, user.uid]
      });
    }

    console.log('User updated with household ID', householdJoinId);
    await AsyncStorage.setItem('@household', householdJoinId);
    dispatch({
      type: UserActionType.UPDATE_HOUSEHOLD,
      householdId: householdJoinId
    });
    router.replace('(tabs)');
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
                onPress={() => {
                  joinHousehold(invite.household, invite.role);
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
