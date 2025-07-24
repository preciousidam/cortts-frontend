import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold
} from '@expo-google-fonts/manrope';
import '../global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/providers/AuthProvider';
import { corttsDarkColors, corttsLightColors } from '@/styleguide/theme/Colors';
import { Fonts } from '@/styleguide/theme/Fonts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppThemeProvider } from '@/styleguide/theme';
import { toastConfig } from '@/components/toast';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);


  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? {...DarkTheme,  colors: {
          ...DefaultTheme.colors, ...corttsDarkColors}, fonts: Fonts} : {...DefaultTheme,  colors: {
          ...DefaultTheme.colors, ...corttsLightColors}, fonts: Fonts}}>
          <AuthProvider>
            <Stack initialRouteName='(app)'>
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(auths)" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
          <Toast
            position='top'
            bottomOffset={20}
            visibilityTime={3000}
            swipeable={true}
            config={toastConfig()}
            autoHide
          />
        </ThemeProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
