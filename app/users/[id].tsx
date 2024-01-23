import React from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../constants/Colors';
import { useUserContext } from '../../contexts';
import { Fonts, Spacers, Style } from '../../constants';

interface ProfileProps {
  photo: string;
  name: string;
  role: string;
  score: number;
  birthday: string;
  householdName: string;
}

const imageUrl = 'https://via.placeholder.com/150';

const UserDetail: React.FC<ProfileProps> = () => {
  const { id } = useGlobalSearchParams();
  const { state } = useUserContext();
  const user = state.householdMembers.find((user) => user.id === id);
  const { householdId } = state;

  return <View style={styles.profileHeader}>
    <View style={styles.profileContent}>
      <Image source={{ uri: user?.photoURL ? user.photoURL : imageUrl }} style={styles.profileImage} />
      <Text style={styles.infoText}>{user?.displayName}</Text>
      <Text style={styles.infoText}>{user?.role}</Text>
    </View>
    <View style={styles.scoreContainer}>
      <Text style={styles.infoText}>🔥 Total score: {user?.totalPoints ?? 0}</Text>
      <Text style={styles.infoText}>💲 Coins: {user?.currentPoints ?? 0}</Text>
    </View>
    <View style={styles.scoreContainer}>
      {user?.birthday && <Text style={styles.infoText}>
        Birthday: {user?.birthday?.toLocaleString()}
      </Text>}
      <Text style={styles.infoText}>Household: {state.householdName}</Text>
      <Text>User ID: {id}</Text>
    </View>
  </View>
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
  }
});

export default UserDetail;
