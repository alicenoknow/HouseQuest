import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import HouseholdSelection from './householdSelection';
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HouseholdViewComponent = () => {
  const [invites, setInvites] = useState<any[]>([]);
  const [householdUpdate, setHouseholdUpdate] = useState<boolean>(false);

  const checkAndCreateUserInFirestore = async () => {
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      const userData = JSON.parse(user);
      const userRef = doc(db, 'users', userData.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && !docSnap.data().household) {
        const invitesQuery = query(
          collection(db, 'invites'),
          where('receiver_email', '==', userData.email)
        );
        const querySnapshot = await getDocs(invitesQuery);
        const invitesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvites(invitesData);
      }

      if (docSnap.exists() && docSnap.data().household) {
        const householdRef = doc(db, 'households', docSnap.data().household);
        const householdDocSnap = await getDoc(householdRef);
        if (householdDocSnap.exists()) {
          const householdData = householdDocSnap.data();
          //check if user is member of household
          if (householdData && householdData.members.includes(userData.uid)) {
            await AsyncStorage.setItem('@household', docSnap.data().household);
            setHouseholdUpdate(true);
          }
        }
      }
    }
  };

  useEffect(() => {
    checkAndCreateUserInFirestore();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HouseholdSelection invites={invites} householdUpdate={householdUpdate} />
    </View>
  );
};

export default HouseholdViewComponent;
