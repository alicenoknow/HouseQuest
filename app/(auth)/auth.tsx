import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import SigninWithGoogle from './signinWithGoogle';

WebBrowser.maybeCompleteAuthSession();

const AuthViewComponent = () => {
  const [userInfo, setUserInfo] = useState(); // This is where you initialize your state
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '353172267978-5geengkovkl0mjorji4hbj19ot6b2i33.apps.googleusercontent.com'
  });

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

  return <SigninWithGoogle promptAsync={promptAsync} />;
};

export default AuthViewComponent;
