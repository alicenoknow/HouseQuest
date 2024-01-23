import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  UserActionType,
  UserProvider,
  useUserContext
} from '../contexts/UserContext';
import { User } from '../models/user';
import RemoteDataProvider from '../components/data/RemoteDataProvider';
import { parseGoogleUserData } from '../functions/parseGoogleUserData';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)'
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [isUserInHousehold, setIsUserInHousehold] = useState<boolean | null>(
    null
  );
  const [user, setUser] = useState<string | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const user = await AsyncStorage.getItem('@user');
      setUser(user);
      setIsUserLoggedIn(!!user); // Set true if user data exists, false otherwise
      console.log('user read from async 1', user);
    };

    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const checkUserHousehold = async () => {
      const household = await AsyncStorage.getItem('@household');
      setHouseholdId(household);
      setIsUserInHousehold(!!household);
      console.log('household from async 1', household);
    };

    checkUserHousehold();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <UserProvider>
      <RootLayoutNav
        isUserLoggedIn={isUserLoggedIn}
        isUserInHousehold={isUserInHousehold}
        user={user}
        householdId={householdId}
      />
    </UserProvider>
  );
}

/**
 * Idea (to discuss/change)
 * 1. We read user and household data from device
 * 2. If there's no data -> redirect to auth
 * 3. If there is user data already but no household -> redirect to household creation screen
 * 4. If there is user data and there is household data -> redirect to (tabs) and surround tabs with UserProvider with proper data
 */

function RootLayoutNav({
  isUserLoggedIn,
  isUserInHousehold,
  user,
  householdId
}: {
  isUserLoggedIn: boolean | null;
  isUserInHousehold: boolean | null;
  user: string | null;
  householdId: string | null;
}) {
  const colorScheme = useColorScheme();
  const { state, dispatch } = useUserContext();
  const [parsedUser, setParsedUser] = useState<User | undefined>(undefined);
  const [parsedHouseholdId, setParsedHouseholdId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    console.log('isUserLoggedIn', isUserLoggedIn, user);
    console.log('isUserInHousehold', isUserInHousehold);

    if (isUserLoggedIn && !!user) {
      const userJson = JSON.parse(user);
      console.log('user from async', userJson);

      const userParsed = parseGoogleUserData(userJson);
      setParsedUser(userParsed);
      dispatch({
        type: UserActionType.LOGIN_USER,
        user: userParsed
      });
    }

    if (isUserInHousehold && !!householdId) {
      console.log('householdId from async', householdId);

      setParsedHouseholdId(householdId);
      dispatch({
        type: UserActionType.UPDATE_HOUSEHOLD,
        householdId: householdId
      });
    }

    if (!isUserLoggedIn) {
      console.log('entering auth');
      router.replace('/auth');
    } else if (!isUserInHousehold) {
      console.log('entering household creation');
      router.replace('/household');
    } else {
      console.log('entring tabs');
      router.replace('(tabs)');
    }
  }, [isUserLoggedIn, isUserInHousehold, user, householdId]);

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <RemoteDataProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="users" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(household)" options={{ headerShown: false }} />
        <Stack.Screen name="invite" options={{ headerShown: false }} />
      </Stack>
    </RemoteDataProvider>
    // </ThemeProvider>
  );
}
