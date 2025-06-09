import { useAuth } from '@/providers/auth';
import { Redirect, Slot, useRouter, useSegments } from 'expo-router';
import { useNavigationState } from '@react-navigation/native';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navReady = useNavigationState((state) => !!state?.key);
  const inAuthGroup = segments[0] === '(auths)';

  if (!isAuthenticated && !inAuthGroup && navReady) {
    return <Redirect href="/(auths)/login" />;
  }

  return <Slot />;
}
// This layout checks authentication status and redirects to login if not authenticated
// It uses the `useSegments` hook to determine if the current route is in the auth group
// and the `useRouter` hook to perform the redirection.
