import { Stack, useGlobalSearchParams } from 'expo-router';

export default function Layout() {
  //can use this to get the id of the user
  const { id } = useGlobalSearchParams();

  return <Stack screenOptions={{ headerShown: false }} />;
}
