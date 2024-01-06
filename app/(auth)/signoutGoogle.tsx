import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../../config';

const SignoutGoogle: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>SignoutGoogle Component</Text>
      <Button
        title="Signout"
        onPress={async () => {
          await signOut(auth);
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
