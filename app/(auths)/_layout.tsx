import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Platform } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  const canShowBackButton = () => {
    return Platform.OS !== 'web';
  }

  if (isAuthenticated) {
    return <Redirect href={'/(app)'} />; // Redirect to role-aware dashboard
  }

  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='login' options={{title: 'Login'}} />
    <Stack.Screen name='register' />
    <Stack.Screen name='forgot-password' options={{ title: '', headerShown: canShowBackButton() }} />
    <Stack.Screen name='verify' />
  </Stack>;
}
