import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useUserContext, UserActionType } from '../contexts/UserContext';
import { Colors, Fonts, Spacers, Style } from '../constants';

const SignOutGoogle: React.FC = () => {
  const { dispatch } = useUserContext();

  const onSignOut = async () => {
    await signOut(auth).then(async () => {
      await AsyncStorage.removeItem('@user');
      await AsyncStorage.removeItem('@household');
      // console.warn('remove');
      dispatch({
        type: UserActionType.LOGOUT_USER,
        user: null
      });
      dispatch({ type: UserActionType.REMOVE_HOUSEHOLD });
      router.replace('/auth');
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onSignOut}>
      <Text style={styles.text}>Sign out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Spacers.medium,
    borderRadius: Style.radius,
    backgroundColor: Colors.pink
  },
  text: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center'
  }
});

export default SignOutGoogle;
