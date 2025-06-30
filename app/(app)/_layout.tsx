import { Redirect, Slot, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auths)';

  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auths)/login" />;
  }

  return <Slot />;
}
// This layout checks authentication status and redirects to login if not authenticated
// It uses the `useSegments` hook to determine if the current route is in the auth group
// and the `useRouter` hook to perform the redirection.
