//create a touchable component that will be used to display an invite to join a household

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Spacers, Style } from '../../constants';
import Icon from '../../components/common/Icon';

interface InviteProps {
  householdName: any;
  onPress: () => void;
}

const HouseholdInvite: React.FC<InviteProps> = ({ householdName, onPress }) => {
  const [showInvite, setShowInvite] = useState<boolean>(false);

  useEffect(() => {
    setShowInvite(true);
  }, []);

  return (
    <View style={styles.container}>
      {showInvite && (
        <TouchableOpacity onPress={onPress} style={styles.invite}>
          <Icon name="add-circle-outline" color={Colors.darkGreen} />
          <Text style={styles.inviteText}>
            Invitation to {householdName.name ?? householdName.id}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGreen, // Feel free to change the background color
    borderRadius: Style.radius,
    padding: Spacers.small,
  },
  invite: {
    flexDirection: "row",
    padding: Spacers.small,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  inviteText: {
    color: Colors.black,
    fontSize: Fonts.small,
    marginLeft: Spacers.small,
  }
});

export default HouseholdInvite;
