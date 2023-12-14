import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';


const Map: React.FC = () => {
    const [location, setLocation] = useState<LatLng | undefined>();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        })();
    }, []);

    return (
        <View style={styles.container}>
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
                        latitude: location?.latitude ?? 37.4226711,
                        longitude: location?.latitude ?? -122.0849872,
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
