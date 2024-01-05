import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SigninWithGoogle from './signinWithGoogle';
import SignoutGoogle from './signoutGoogle';

WebBrowser.maybeCompleteAuthSession();

const AuthViewComponent = () => {
  const [userInfo, setUserInfo] = useState<FirebaseUser | undefined>(undefined); // Update the type of userInfo
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '353172267978-g4n3f0m0un08eptet0i1e8qoi6ud1981.apps.googleusercontent.com',
    webClientId:
      '353172267978-5geengkovkl0mjorji4hbj19ot6b2i33.apps.googleusercontent.com'
  });

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
      const { idToken } = response.params;
      const credential = GoogleAuthProvider.credential(idToken);
      if (credential) {
        signInWithCredential(auth, credential)
          .then((result) => {
            // Handle the sign-in result
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user', JSON.stringify(user, null, 2));
        setUserInfo(user);
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      } else {
        console.log('no user signed in');
      }
    });
    return () => unsubscribe();
  }, []);

  return userInfo ? (
    <SignoutGoogle />
  ) : (
    <SigninWithGoogle promptAsync={promptAsync} />
  );
};

export default AuthViewComponent;
