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
import { Role, User } from '../models/user';
import { AnnouncementProvider } from '../contexts/AnnouncementsContext';
import { TodoProvider } from '../contexts/TodoContext';
import { RewardsProvider } from '../contexts/RewardsContext';
import { KudosOrSlobsProvider } from '../contexts/KudosContext';
import { TaskProvider } from '../contexts/TasksContext';
import RemoteDataProvider from '../components/data/RemoteDataProvider';
import { parseGoogleUserData } from '../functions/parseGoogleUserData';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)'
};

const mockState = {
  householdId: 'CJAqIX3OJFz3k9IUX48T',
  user: {
    id: 'ZCCW8ZX1qUe7nRvJnI28UrlCsPu1',
    displayName: 'Alicja Niewiadomska',
    email: 'miicek2000@gmail.com',
    role: Role.PARENT,
    totalPoints: 0,
    currentPoints: 0,
    photoUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocKfud8LsMN1tL_lZRNjDcoeHvBFhqSwzikbomi4TzZO=s96-c'
  },
  householdMembers: [
    {
      id: 'ZCCW8ZX1qUe7nRvJnI28UrlCsPu1',
      displayName: 'Alicja Niewiadomska',
      email: 'micek2000@gmail.com',
      role: Role.PARENT,
      totalPoints: 0,
      currentPoints: 0,
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocKfud8LsMN1tL_lZRNjDcoeHvBFhqSwzikbomi4TzZO=s96-c'
    }
  ]
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [userHousehold, setUserHousehold] = useState<boolean | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const user = await AsyncStorage.getItem('@user');
      setUser(user);
      setIsUserLoggedIn(!!user); // Set true if user data exists, false otherwise
      console.log('user', user);
    };

    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const checkUserHousehold = async () => {
      const household = await AsyncStorage.getItem('@household');
      setHouseholdId(household);
      setUserHousehold(!!household);
      console.log('household', household);
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
    <RootLayoutNav
      isUserLoggedIn={isUserLoggedIn}
      userHousehold={userHousehold}
      user={user}
      householdId={householdId}
    />
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
  userHousehold,
  user,
  householdId
}: {
  isUserLoggedIn: boolean | null;
  userHousehold: boolean | null;
  user: string | null;
  householdId: string | null;
}) {
  const colorScheme = useColorScheme();
  const { dispatch } = useUserContext();
  const [parsedUser, setParsedUser] = useState<User | undefined>(undefined);
  const [parsedHouseholdId, setParsedHouseholdId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    console.log('isUserLoggedIn', isUserLoggedIn);
    console.log('user_root', user);
    if (isUserLoggedIn) {
      if (!!user) {
        const userJson = JSON.parse(user);
        console.log('userJson_root', userJson);
        setParsedUser(parseGoogleUserData(userJson));
      }
    }

    console.log('userHousehold', userHousehold);
    if (userHousehold) {
      if (!!householdId) {
        console.log('householdId', householdId);
        setParsedHouseholdId(householdId);
      }
    }

    if (!isUserLoggedIn) {
      router.replace('/auth');
    } else if (!userHousehold) {
      console.log('entering household creation');
      router.replace('/household');
    } else {
      router.replace('(tabs)');
    }
  }, [isUserLoggedIn]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider
        initialState={{
          user: parsedUser,
          householdId: parsedHouseholdId,
          householdMembers: []
        }}>
        <RemoteDataProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="users" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(household)" options={{ headerShown: false }} />
          </Stack>
        </RemoteDataProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
