import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  UserActionType,
  useLocationShare,
  useUserContext
} from '../../../contexts';
import { fetchMembers, updateUserLocation } from '../../../remote/db';
import ShareLocationOverlay from './ShareLocationOverlay';
import blueMarker from './blueMarker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { User } from '../../../models';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config';

// TODO refactor, basically rewrite, extract components, fix styling

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

async function requestPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Foreground permission not granted');
    return;
  }

  status = (await Location.requestBackgroundPermissionsAsync()).status;
  if (status !== 'granted') {
    console.error('Background permission not granted');
    return;
  }
}

const Map: React.FC = () => {
  const { state: locationShareState } = useLocationShare();
  const { state: userState, dispatch: dispatchUserState } = useUserContext();
  const { user, householdId, householdMembers } = userState;
  const userId = user?.id;
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const [members, setMembers] = useState<User[]>([]);
  const memberUpdateTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMembers([...householdMembers]);
    console.log('householdMembers', householdMembers);
  }, [userState]);

  useEffect(() => {
    if (!currentLocation) return;

    const currentLocationLatLng: LatLng = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    };
    if (locationShareState.isEnabled) {
      updateUserLocation(userId!, currentLocationLatLng);
    }
  }, [currentLocation]);

  useEffect(() => {
    requestPermissions();

    // Update user location every 30 seconds
    const locationUpdateSubscription = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 30000 },
      (newLocation) => {
        setCurrentLocation(newLocation);
      }
    );

    const updateMembers = async () => {
      if (!householdId) return;

      // Fetch members' data from Firestore
      try {
        const membersRef = doc(db, 'households', householdId);
        const snapshot = await getDoc(membersRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          const memberIds = data.members;

          const fetchedMembers = await Promise.all(
            memberIds.map(async (id: string) => {
              const memberRef = doc(db, 'users', id);
              const memberDoc = await getDoc(memberRef);
              if (memberDoc.exists()) {
                return memberDoc.data() as User;
              }
              throw new Error(`Member not found: ${id}`);
            })
          );

          // Update members' data in state
          fetchedMembers.forEach((member) => {
            dispatchUserState({
              type: UserActionType.UPDATE_MEMBER,
              member: member
            });
          });

          // If the current user's data is also fetched
          const currentUserData = fetchedMembers.find(
            (member) => member.id === userId
          );
          if (currentUserData) {
            dispatchUserState({
              type: UserActionType.UPDATE_USER,
              user: currentUserData
            });
          }
        } else {
          throw new Error('Household not found');
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    // Initialize member location update process
    updateMembers();

    // Set interval to update member locations every 3 minutes
    const memberUpdateInterval = setInterval(() => {
      updateMembers();
      console.log('Updated members:', members);
    }, 180000); // 3 minutes

    return () => {
      locationUpdateSubscription.then((subscription) => subscription.remove());
      clearInterval(memberUpdateInterval);
    };
  }, [householdId]);

  const handleCenter = () => {
    if (currentLocation && mapRef.current) {
      console.log('Centering map on current location');
      const { latitude, longitude } = currentLocation.coords;
      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      };
      mapRef.current.animateCamera({
        center: { latitude: region.latitude, longitude: region.longitude },
        zoom: 15,
        pitch: 0,
        heading: 0
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 38.7252,
          longitude: -9.1499,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>
        <Marker
          coordinate={{
            latitude: currentLocation?.coords.latitude ?? 37.4226711,
            longitude: currentLocation?.coords.longitude ?? -122.0849872
          }}
          title="Marker Title"
          description="Marker Description">
          <View>{blueMarker()}</View>
        </Marker>
        {members
          .filter(
            (member) =>
              member.location &&
              member.location.latitude !== undefined &&
              member.location.longitude !== undefined &&
              member.location?.latitude &&
              member.location?.longitude
          )
          .map((member) => {
            const formatDateFromFirestoreTimestamp = (
              timestamp: FirestoreTimestamp | undefined
            ) => {
              if (!timestamp || typeof timestamp.seconds !== 'number') {
                return 'Not Available';
              }
              const date = new Date(timestamp.seconds * 1000);
              return date.toLocaleString(); // Returns the date in the local time zone.
            };

            return (
              <Marker
                key={member.id}
                coordinate={{
                  latitude: member.location!.latitude,
                  longitude: member.location!.longitude
                }}
                title={member.displayName}
                description={`Last Updated: ${formatDateFromFirestoreTimestamp(
                  member.locationUpdatedAt
                )}`}
                onPress={() => {
                  console.log('pressed');
                }}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('pressed');
                    }}>
                    <Image
                      source={{ uri: member.photoURL }}
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                    />
                  </TouchableOpacity>
                </View>
              </Marker>
            );
          })}
        {/* otherMarkers.map((marker) => ( */}
      </MapView>
      <MaterialCommunityIcons
        style={styles.centerLocation}
        name="crosshairs-gps"
        size={40}
        color="black"
        onPress={handleCenter}
      />
      <ShareLocationOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  centerLocation: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Feel free to change the background color
    padding: 5,
    borderRadius: 20,
    elevation: 3, // Shadow for Android
    shadowOpacity: 0.3, // Shadow for iOS
    zIndex: 1,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 1 }
  },
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});

export default Map;
