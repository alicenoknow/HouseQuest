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
    }
  };

  useEffect(() => {
    checkAndCreateUserInFirestore();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HouseholdSelection invites={invites} />
    </View>
  );
};

export default HouseholdViewComponent;
