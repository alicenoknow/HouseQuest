import { Stack, useGlobalSearchParams } from 'expo-router';

export default function Layout() {
  //can use this to get the id of the user, and present dynamic data on the header??
  const { id } = useGlobalSearchParams();

  return <Stack screenOptions={{ headerTitle: 'User Info' }} />;
}
