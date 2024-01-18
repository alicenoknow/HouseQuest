//create a touchable component that will be used to display an invite to join a household

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InviteProps {
  householdName: any;
  onPress: () => void;
}

const HouseholdInvite: React.FC<InviteProps> = ({ householdName, onPress }) => {
  const [showInvite, setShowInvite] = useState<boolean>(false);

  useEffect(() => {
    setShowInvite(true);
  }, []);

  console.log('householdName', householdName);

  return (
    <View style={styles.container}>
      {showInvite && (
        <TouchableOpacity onPress={onPress} style={styles.invite}>
          <Text style={styles.inviteText}>
            You have been invited to join {householdName.household}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 122, 255, 0.7)', // Feel free to change the background color
    padding: 5,
    borderRadius: 20,
    elevation: 3, // Shadow for Android
    shadowOpacity: 0.3, // Shadow for iOS
    zIndex: 1,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 }
  },
  invite: {
    padding: 5
  },
  inviteText: {
    color: 'white',
    fontSize: 16
  }
});

export default HouseholdInvite;
