import { Redirect, Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/auth';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    return <Redirect href={'/(app)'} />; // Redirect to role-aware dashboard
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
