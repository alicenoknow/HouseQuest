import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocation } from './useLocation';
import ShareLocationOverlay from './ShareLocationOverlay';

// TODO refactor, basically rewrite, extract components, fix styling

const Map: React.FC = () => {
    const location = useLocation();

    return (
        <View style={styles.container}>
            <ShareLocationOverlay />
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.4226711,
                    longitude: -122.0849872,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location?.coords.latitude ?? 37.4226711,
                        longitude: location?.coords.longitude ?? -122.0849872,
                    }}
                    title="Marker Title"
                    description="Marker Description"
                />
                {/* Add more markers as needed */}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default Map;
