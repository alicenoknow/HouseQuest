import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../constants/Colors';
import { useUserContext } from '../../../contexts/UserContext';
import { Fonts, Spacers, Style } from '../../../constants';
import SignOutGoogle from '../../../components/signoutGoogle';

const Profile: React.FC = () => {
  const { state } = useUserContext();
  const { user } = state;
  const { photoURL, displayName, role, totalPoints, currentPoints, birthday } = user || {
    photoURL: 'https://via.placeholder.com/150',
    displayName: 'Name',
    role: 'Role',
    totalPoints: 0,
    currentPoints: 0,
    birthday: new Date()
  };

  const renderProfileInfo = () =>
    <View style={styles.profileHeader}>
      <View style={styles.profileContent}>
        <Image source={{ uri: photoURL }} style={styles.profileImage} />
        <Text style={styles.infoText}>{displayName}</Text>
        <Text style={styles.infoText}>{role}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.infoText}>🔥 Total score: {totalPoints}</Text>
        <Text style={styles.infoText}>💲 Coins: {currentPoints}</Text>
      </View>
      <View style={styles.scoreContainer}>
        {birthday && <Text style={styles.infoText}>
          Birthday: {birthday?.toLocaleString()}
        </Text>}
        <Text style={styles.infoText}>Household: {state.householdName}</Text>
      </View>
    </View>

  const renderSettingsButton = () => <TouchableOpacity
    style={styles.settingsButton}
    onPress={() => { }}>
    <Text style={styles.settingsText}>Settings</Text>
  </TouchableOpacity>

  return (
    <View style={styles.container}>
      {renderProfileInfo()}
      <View style={styles.buttons}>
        {renderSettingsButton()}
        <SignOutGoogle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  profileHeader: {
    alignItems: 'center',
    width: '100%',
    marginTop: Spacers.medium
  },
  profileContent: {
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    marginTop: -40, // for status bar
    paddingVertical: Spacers.medium,
    paddingTop: Spacers.xLarge,
    width: "100%"
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginTop: 50
  },
  scoreContainer: {
    marginTop: Spacers.large,
    borderRadius: Style.radius,
    backgroundColor: Colors.lightGrey,
    padding: Spacers.medium,
    width: "80%"
  },
  infoText: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
  },
  button: {
    marginTop: Spacers.medium,
    padding: Spacers.medium,
    alignItems: 'center',
  },
  settingsButton: {
    width: "40%",
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.medium,
    marginVertical: Spacers.medium,

  },
  settingsText: {
    color: Colors.white,
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    textAlign: "center"
  },
  buttons: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  }
});

export default Profile;
