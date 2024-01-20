import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useUserContext, UserActionType } from '../contexts/UserContext';

const SignoutGoogle: React.FC = () => {
  const { dispatch } = useUserContext();
  return (
    <View style={styles.container}>
      <Text>SignoutGoogle Component</Text>
      <Button
        title="Signout"
        onPress={async () => {
          await signOut(auth).then(async () => {
            AsyncStorage.removeItem('@user');
            AsyncStorage.removeItem('@household');
            dispatch({
              type: UserActionType.LOGOUT_USER,
              user: null
            });
            dispatch({
              type: UserActionType.REMOVE_HOUSEHOLD,
              householdId: undefined
            });
            router.replace('/auth');
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SignoutGoogle;
