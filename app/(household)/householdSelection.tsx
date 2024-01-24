import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { db } from '../../config';
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { firebaseUser } from '../../models/firebaseUser';
import { Role } from '../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HouseholdInvite from './householdInviteCard';
import { router } from 'expo-router';
import { UserActionType, useUserContext } from '../../contexts/UserContext';
import { Colors, Fonts, Spacers, Style } from '../../constants';

interface Invite {
  id: string;
  role: Role;
  name: string | undefined;
}

const HouseholdSelection: React.FC = () => {
  const [user, setUser] = React.useState<firebaseUser>();
  const [householdInput, setHouseholdInput] = React.useState<string>('');
  const [inviteHouseholds, setInviteHouseholds] = React.useState<
    ReadonlyArray<Invite>
  >([]);
  const { state, dispatch } = useUserContext();

  const updateHouseholdAndLogin = (household: string | null) => {
    // console.warn("update household", household)
    if (household) {
      AsyncStorage.setItem('@household', household);
      dispatch({
        type: UserActionType.UPDATE_HOUSEHOLD,
        householdId: household
      });
      router.replace('(tabs)');
    }
  };

  const getUser = async () => {
    await AsyncStorage.getItem('@user').then((user) => {
      if (user && JSON.parse(user)) {
        const userJson = JSON.parse(user);
        setUser(userJson);
      } else {
        console.log('empty user in async', user);
        // router.replace('/auth');
        return;
      }
    });
  };

  const getHousehold = async () => {
    await AsyncStorage.getItem('@household').then((h) =>
      updateHouseholdAndLogin(h)
    );
  };

  useEffect(() => {
    getUser();
    getHousehold();
  }, []);

  const refreshInvites = async () => {
    if (!user) {
      console.log('No user found!');
      return;
    }
    const userRef = doc(db, 'users', user?.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData?.household) {
        updateHouseholdAndLogin(userData.household);
      } else {
        const inviteQuery = query(
          collection(db, 'invites'),
          where('receiver_email', '==', user?.email)
        );
        const inviteSnapshot = await getDocs(inviteQuery);
        const invites = await Promise.all(
          inviteSnapshot.docs.map(async (invite) => {
            const householdRef = doc(db, 'households', invite.data().household);
            const household = await getDoc(householdRef);

            return {
              id: invite.data().household,
              role: invite.data().role,
              name: household?.data()?.name
            };
          })
        );
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
      console.log('No user found! 2');
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
    dispatch({
      type: UserActionType.UPDATE_HOUSEHOLD_NAME,
      name: householdValue
    });
    updateHouseholdAndLogin(householdRef.id);
  };

  const joinHousehold = async (householdJoinId: string, inviteRole: string) => {
    if (!user) {
      console.log('No user found! 3');
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
      updateHouseholdAndLogin(householdJoinId);
      dispatch({
        type: UserActionType.UPDATE_HOUSEHOLD_NAME,
        name: householdDoc.data().name
      });
    }
    console.log('User updated with household ID', householdJoinId);
  };

  const renderSpacer = () => <View style={{ width: '100%', height: 10 }} />;

  return (
    <View style={styles.container}>
      {state?.householdName ? (
        <Text style={styles.infoText}>
          Household: {state.householdName ?? state.householdId}
        </Text>
      ) : (
        <>
          <Text style={styles.infoText}>No households available 😥</Text>
          {renderSpacer()}
          <Text style={styles.infoText}>Invites:</Text>
          {renderSpacer()}
          {inviteHouseholds.length > 0 ? (
            inviteHouseholds.map((invite, index) => (
              <HouseholdInvite
                key={index}
                householdName={invite}
                onPress={() => joinHousehold(invite.id, invite.role)}
              />
            ))
          ) : (
            <Text style={styles.infoText}>No invites available.</Text>
          )}

          {renderSpacer()}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.darkGreen }]}
            onPress={refreshInvites}>
            <Text style={styles.buttonText}>Refresh invites</Text>
          </TouchableOpacity>

          {renderSpacer()}
          {renderSpacer()}

          <TextInput
            style={styles.input}
            placeholder="Enter household name"
            onChangeText={(text) => setHouseholdInput(text)}
            defaultValue={householdInput}
          />
          <TouchableOpacity
            disabled={!householdInput}
            style={[styles.button, { opacity: !householdInput ? 0.5 : 1 }]}
            onPress={() => createHousehold(user, householdInput)}>
            <Text style={styles.buttonText}>🏠 Create household</Text>
          </TouchableOpacity>
        </>
      )}
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
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    marginVertical: Spacers.medium,
    padding: Spacers.medium,
    borderRadius: Style.radius,
    fontSize: Fonts.medium
  },
  button: {
    width: '60%',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    padding: Spacers.medium,
    borderRadius: Style.radius,
    marginVertical: Spacers.medium
  },
  buttonText: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center'
  },
  infoText: {
    fontSize: Fonts.medium,
    color: Colors.black,
    textAlign: 'center'
  }
});

export default HouseholdSelection;
