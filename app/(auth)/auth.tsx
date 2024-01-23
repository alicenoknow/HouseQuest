// React and React Native imports
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

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
import SignInWithGoogle from './signinWithGoogle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext, UserActionType } from '../../contexts/UserContext';
import { parseGoogleUserData } from '../../functions/parseGoogleUserData';

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID =
  '353172267978-g4n3f0m0un08eptet0i1e8qoi6ud1981.apps.googleusercontent.com';
const WEB_CLIENT_ID =
  '353172267978-5geengkovkl0mjorji4hbj19ot6b2i33.apps.googleusercontent.com';
const redirectUri = makeRedirectUri({
  scheme: 'com.homequest.homequestapp',
  path: '/auth'
});

const checkAndCreateUserInFirestore = async (user: FirebaseUser) => {
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
};

const AuthViewComponent = () => {
  const [isLoading, setLoading] = useState(false);

  const [_request, response, promptAsync] = Google.useAuthRequest({
    redirectUri,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID
  });
  const { dispatch } = useUserContext(); // Use the context hook to get the dispatch function

  const checkIfUserLoggedIn = async () => {
    try {
      await AsyncStorage.getItem('@user').then((user) => {
        if (user) {
          const userJson = JSON.parse(user);
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
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
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
        setLoading(true);
        await checkAndCreateUserInFirestore(user);
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        router.replace('/household');
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      {isLoading ? <ActivityIndicator size={40} /> :
        <SignInWithGoogle promptAsync={promptAsync} />}
    </View>
  );
};

export default AuthViewComponent;
