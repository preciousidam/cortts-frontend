import { Redirect, Slot, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator } from 'react-native';

export default function Layout() {
  const { isAuthenticated, role } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auths)';

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auths)/login" />;
  }

  if (!role){
    return <ActivityIndicator />
  }

  // if (role == 'admin') {
  //   return <Redirect href="/(app)/(admin)" />
  // } else if (role == 'agent') {
  //   return <Redirect href="/(app)/(agent)" />
  // } else if (role == 'client') {
  //   return <Redirect href="/(app)/(client)" />
  // }

  return <Slot />;
}
// This layout checks authentication status and redirects to login if not authenticated
// It uses the `useSegments` hook to determine if the current route is in the auth group
// and the `useRouter` hook to perform the redirection.
