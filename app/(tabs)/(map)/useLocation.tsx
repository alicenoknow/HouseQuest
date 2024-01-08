import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

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

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  console.log(location);

  return location;
};
