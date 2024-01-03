import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

const authViewComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.blueContainer}>
          {/* <Image source={{ uri: imageUrl }} style={styles.profileImage} /> */}

          {/* <Image source={{ uri: photo }} style={styles.profileImage} /> */}
          <Text style={styles.name}>Teste</Text>
          <Text style={styles.role}>Parent</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>Score: </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.birthday}>Birthday: </Text>
          <Text style={styles.householdName}>Household: </Text>
        </View>
      </View>
      <Text>User ID: </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  profileHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  blueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: Colors.white,
    marginBottom: 10
  },
  name: {
    fontSize: 28,
    color: Colors.black,
    fontWeight: '600'
  },
  role: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '600'
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  score: {
    fontSize: 28,
    color: Colors.black,
    fontWeight: '600'
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%'
  },
  birthday: {
    fontSize: 28,
    color: Colors.black,
    fontWeight: '600'
  },
  householdName: {
    fontSize: 28,
    color: Colors.black,
    fontWeight: '600'
  }
});

export default authViewComponent;
