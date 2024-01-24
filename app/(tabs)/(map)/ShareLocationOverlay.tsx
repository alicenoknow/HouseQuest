import React, { useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';
import { useLocationShare } from '../../../contexts/LocationShareContext';

const ShareLocationOverlay = () => {
  const { state, dispatch } = useLocationShare();

  const toggleSwitch = () => {
    dispatch({ type: 'TOGGLE' });
  };
  console.log('overlay');
  console.log('TOGGLE', state.isEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>Share Location</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={state.isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: 35,
    top: 20,
    right: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.7)', // Feel free to change the background color
    padding: 5,
    borderRadius: 20,
    elevation: 3, // Shadow for Android
    shadowOpacity: 0.3, // Shadow for iOS
    zIndex: 1,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 }
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginRight: 8, // Add some spacing between the text and the switch
    paddingLeft: 8,
    color: 'white', // You can change the color to fit your design
    fontSize: 16 // Adjust the font size as needed
  }
});

export default ShareLocationOverlay;
