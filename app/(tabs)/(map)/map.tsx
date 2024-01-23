import React, { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, View, Image } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useUserContext } from '../../../contexts';
import { fetchMembers, updateUserLocation } from '../../../remote/db';
import updateUserContextWithMembers from '../../../functions/updateUserContextWithMembers';
import ShareLocationOverlay from './ShareLocationOverlay';
import blueMarker from './blueMarker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { User } from '../../../models';

// TODO refactor, basically rewrite, extract components, fix styling
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
  const { state: userState } = useUserContext();
  const { user, householdId, householdMembers } = userState;
  const userId = user?.id;
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const [memberLocations, setMemberLocations] = useState<User[]>([]);
  const memberUpdateTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMemberLocations([...householdMembers]);
  }, [userState]);

  useEffect(() => {
    if (householdId) {
      updateUserContextWithMembers();
    }
  }, [householdId]);

  useEffect(() => {
    requestPermissions();

    // Update user location every 30 seconds
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 30000 },
      (newLocation) => {
        setCurrentLocation(newLocation);
      }
    );

    // Fetch and update member locations every 3 minutes
    memberUpdateTimer.current = setInterval(() => {
      updateUserContextWithMembers();
    }, 180000); // 3 minutes

    return () => {
      if (memberUpdateTimer.current) {
        clearInterval(memberUpdateTimer.current);
      }
    };
  }, []);

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
        {memberLocations
          .filter(
            (member) =>
              member.location &&
              member.location.latitude !== undefined &&
              member.location.longitude !== undefined &&
              member.location?.latitude &&
              member.location?.longitude
          )
          .map((member) => (
            <Marker
              key={member.id}
              coordinate={{
                latitude: member.location!.latitude,
                longitude: member.location!.longitude
              }}
              title={member.displayName}>
              <View>
                <Image
                  source={{ uri: member.photoURL }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
              </View>
            </Marker>
          ))}
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
