import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SigninWithGoogle from './signinWithGoogle';
import { View } from 'react-native';
import { User, Role } from '../../models';
import { useUserContext, UserActionType } from '../../contexts/UserContext';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
  scheme: 'com.homequest.homequestapp',
  path: '/auth'
});

const parseGoogleUserData = (googleUserData: any): User => {
  return {
    id: googleUserData.uid,
    displayName: googleUserData.displayName,
    email: googleUserData.email,
    role: Role.PARENT, // Assuming a default role
    totalPoints: 0, // Default or calculated value
    currentPoints: 0, // Default or calculated value
    photoUrl: googleUserData.photoURL,
    location: undefined // Default or actual value
  };
};

const checkAndCreateUserInFirestore = async (
  user: FirebaseUser,
  setInvites: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  }

  if (docSnap.exists() && !docSnap.data().household) {
    // 'household' field does not exist, check for invites
    const invitesQuery = query(
      collection(db, 'invites'),
      where('receiver_email', '==', user.email)
    );
    const querySnapshot = await getDocs(invitesQuery);

    querySnapshot.forEach((doc) => {
      // Process each invite
      console.log(`Invite found: ${doc.id}`, doc.data());
      // Here, you can handle the invite, like assigning the household ID to the user
    });
    const invitesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('invitesData', invitesData);
    setInvites(invitesData); // Update the state with the invites
  }
};

const AuthViewComponent = () => {
  const [userInfo, setUserInfo] = useState<FirebaseUser | undefined>(undefined); // Update the type of userInfo
  const [invites, setInvites] = useState<any[]>([]); // Update the type of userInfo
  const [request, response, promptAsync] = Google.useAuthRequest({
    redirectUri,
    androidClientId:
      '353172267978-g4n3f0m0un08eptet0i1e8qoi6ud1981.apps.googleusercontent.com',
    webClientId:
      '353172267978-5geengkovkl0mjorji4hbj19ot6b2i33.apps.googleusercontent.com'
  });
  const { dispatch } = useUserContext(); // Use the context hook to get the dispatch function

  const checkIfUserLoggedIn = async () => {
    try {
      const user = await AsyncStorage.getItem('@user');
      if (user) {
        console.log('user', user);
        const userJson = JSON.parse(user);
        setUserInfo(userJson);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    console.log('response', response);
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication!;
      console.log('idToken', idToken);
      console.log('accessToken', accessToken);
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      console.log('credential', credential);
      if (credential) {
        signInWithCredential(auth, credential)
          .then((result) => {
            // Handle the sign-in result
            const parsedUser = parseGoogleUserData(result);
            dispatch({ type: UserActionType.LOGIN_USER, user: parsedUser });
            console.log('result', result);
          })
          .catch((error) => {
            // Handle errors here
            console.log('error', error);
          });
      }
    }
  }, [response]);

  useEffect(() => {
    checkIfUserLoggedIn();
    const unsub = onAuthStateChanged(auth, async (user) => {
      console.log('user_pre', user);
      console.log('auth', auth);
      if (user) {
        console.log('user_acc', JSON.stringify(user, null, 2));
        setUserInfo(user);
        await checkAndCreateUserInFirestore(user, setInvites);
        console.log('invites', invites);
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      } else {
        console.log('no user signed in');
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      {/* userInfo ? ( */}
      {/* ) : ( */}
      <View
        style={{
          flex: 1
        }}>
        <SigninWithGoogle promptAsync={promptAsync} />
        {/* <HouseholdSelection invites={invites} /> */}
        {/* <SignoutGoogle /> */}
      </View>
      {/* ) */}
    </>
  );
};

export default AuthViewComponent;
