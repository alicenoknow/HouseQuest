import React, { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocation } from './useLocation';
import ShareLocationOverlay from './ShareLocationOverlay';
import blueMarker from './blueMarker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const mapRef: any = React.createRef();

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      if (!location) {
        console.error('No location data received');
        return;
      }
      if (
        currentLocation &&
        location.coords.latitude === currentLocation.coords.latitude &&
        location.coords.longitude === currentLocation.coords.longitude
      ) {
        console.log('Location has not changed');
        return;
      }

      setCurrentLocation(location);
      console.log('Updated Location:', location);
    };

    requestPermissions().then(() => fetchLocation());
    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [currentLocation]); // Dependency on currentLocation to avoid unnecessary updates

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
