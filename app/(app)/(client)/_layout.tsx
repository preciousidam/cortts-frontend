import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import Colors, { generateColorScale } from '@/styleguide/theme/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomDrawer } from '@/components/navigation/drawer';
import Drawer from 'expo-router/drawer';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { CustomHeader } from '@/components/navigation/header';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const TabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const {colors} = useTheme();
  const {fontPixel, heightPixel, widthPixel} = useResponsive();

  if (Platform.OS === 'web') {
    // On web, we use a client-only value to prevent hydration errors with the header.
    return (
      <GestureHandlerRootView>
        <Drawer
          screenOptions={({ route }) => ({
            drawerActiveTintColor: generateColorScale(colors.primary).normalBase,
            drawerInactiveTintColor: Colors[colorScheme ?? 'light'].text,
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, true),
            drawerItemStyle: {
              borderRadius: widthPixel(8),
            },
            drawerType: 'permanent',
            drawerIcon: (props) => {
              if (route.name === 'index') {
                return <Ionicons name='grid-outline' {...props} />;
              } else if (route.name === 'Projects') {
                return <MaterialCommunityIcons name="home-city-outline" {...props} />;
              } else if (route.name === 'Units') {
                return <AntDesign name='home' {...props} />;
              }
              return <TabBarIcon name="bars" {...props} />;
            },
            drawerLabelStyle: {
              fontSize: fontPixel(14),
            },
            drawerStyle: {
              paddingVertical: heightPixel(24),
              width: widthPixel(272),
            },
            header: props => <CustomHeader {...props} />
          })}
          drawerContent={props => <CustomDrawer {...props} />}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: 'Overview',
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    )
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />
        }}
      />
    </Tabs>
  );
}

export default TabLayout;