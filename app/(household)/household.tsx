import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import HouseholdSelection from './householdSelection';
import {
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserActionType, useUserContext } from '../../contexts';
import { router } from 'expo-router';

const HouseholdViewComponent = () => {
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useUserContext();

  const checkAndCreateUserInFirestore = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      const userData = JSON.parse(user);
      const userRef = doc(db, 'users', userData.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().household) {
        const currentHousehold = docSnap.data().household;
        const householdRef = doc(db, 'households', currentHousehold);
        const householdDocSnap = await getDoc(householdRef);
        if (householdDocSnap.exists()) {
          const householdData = householdDocSnap.data();
          //check if user is member of household
          if (householdData && householdData.members.includes(userData.uid)) {
            await AsyncStorage.setItem('@household', currentHousehold);
            dispatch({
              type: UserActionType.UPDATE_HOUSEHOLD,
              householdId: currentHousehold
            });
            dispatch({
              type: UserActionType.UPDATE_HOUSEHOLD_NAME,
              name: docSnap.data().name,
            });
            router.replace('(tabs)');
          }
        }
      }
    } else {
      router.replace('/auth');
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAndCreateUserInFirestore();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <ActivityIndicator size={40} /> :
        <HouseholdSelection />}
    </View>
  );
};

export default HouseholdViewComponent;
