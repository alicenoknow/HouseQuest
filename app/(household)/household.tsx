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
      console.log('userData', userData);
      console.log('userData.uid', userData.uid);

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
        console.log(householdDocSnap.data());
        if (householdDocSnap.exists()) {
          const householdData = householdDocSnap.data();
          console.log('householdData', householdData);
          //check if user is member of household 
          //householdData {"announcements": ["Q5A6Q57PCkpq2v2QlTnc"], "kudos": ["yOkz89qjio41QJ8UmNKM"], "members": ["ZCCW8ZX1qUe7nRvJnI28UrlCsPu1", "YW9HoeSFrJSpeMJE1hZXDn0B6IG2", "GNwJp9dwjOdePt7kckJOdhP6APt2"], "name": "MojoDojoCasaHouse", "owner": "ZCCW8ZX1qUe7nRvJnI28UrlCsPu1", "rewards": ["4y36YAnF6FIibfxviDGM"], "tasks": ["hkyGnY6oJsI5aoNRDfLu", "8pagv6XCDvpbI8cxG5qr", "bYz4CBKazKQHcyV0c6Ga", "HTXEkZwioTmagqDeTnYY"], "todos": ["9h0tBkIvUrZiEAdXZE1a"]}
          if (
            householdData 
            && 
            householdData.members.includes(userData.uid)
            ) {
            await AsyncStorage.setItem(
              '@household',
              JSON.stringify(householdData)
            );
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
