// React and React Native imports
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

// Firebase imports
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

// Expo imports
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';

// Local imports
import SigninWithGoogle from './signinWithGoogle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Role } from '../../models';
import { useUserContext, UserActionType } from '../../contexts/UserContext';
import { firebaseUser } from '../../models/firebaseUser';
import { FirebaseError } from 'firebase/app';

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID =
  '353172267978-g4n3f0m0un08eptet0i1e8qoi6ud1981.apps.googleusercontent.com';
const WEB_CLIENT_ID =
  '353172267978-5geengkovkl0mjorji4hbj19ot6b2i33.apps.googleusercontent.com';
const redirectUri = makeRedirectUri({
  scheme: 'com.homequest.homequestapp',
  path: '/auth'
});

const parseGoogleUserData = (googleUserData: firebaseUser): User => {
  console.log('googleUserData', googleUserData);
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
  const [userInfo, setUserInfo] = useState<FirebaseUser | undefined>(undefined);
  const [invites, setInvites] = useState<any[]>([]);
  const [request, response, promptAsync] = Google.useAuthRequest({
    redirectUri,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID
  });
  const { dispatch } = useUserContext(); // Use the context hook to get the dispatch function

  const checkIfUserLoggedIn = async () => {
    try {
      await AsyncStorage.getItem('@user').then((user) => {
        if (user) {
          console.log('user', user);
          const userJson = JSON.parse(user);
          setUserInfo(userJson);
          const parsedUser = parseGoogleUserData(userJson);
          dispatch({ type: UserActionType.LOGIN_USER, user: parsedUser });
          router.replace('/household');
        }
      });
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
            const parsedResultUser: any = result.user.toJSON();
            if (
              parsedResultUser &&
              typeof parsedResultUser.email === 'string' &&
              typeof parsedResultUser.uid === 'string' &&
              typeof parsedResultUser.displayName === 'string' &&
              typeof parsedResultUser.photoURL === 'string'
            ) {
              const parsedGoogleUser = parseGoogleUserData(parsedResultUser);
              dispatch({
                type: UserActionType.LOGIN_USER,
                user: parsedGoogleUser
              });
            }
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserInfo(user);
        await checkAndCreateUserInFirestore(user, setInvites);
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        router.replace('/household');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <View style={{ flex: 1 }}>
        <SigninWithGoogle promptAsync={promptAsync} />
      </View>
    </>
  );
};

export default AuthViewComponent;
