import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignoutGoogle: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>SignoutGoogle Component</Text>
      <Button
        title="Signout"
        onPress={async () => {
          await signOut(auth).then(async () => {
            AsyncStorage.removeItem('@user');
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
