'use client';;
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/styleguide/theme/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import Drawer from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { CustomHeader } from '@/components/navigation/header';
import { PaymentSVG, UnitSVG, UsersSVG } from '@/components/pages/dashboard/svg';
import { Platform } from 'react-native';
import { CustomDrawer } from '@/components/navigation/drawer';
import { Tabs, useSegments } from 'expo-router';
// import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

// export default function TabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <Label>Home</Label>
//         <Icon sf="house.fill" drawable="custom_android_drawable" />
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="settings">
//         <Icon sf="gear" drawable="custom_settings_drawable" />
//         <Label>Settings</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }


export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const Layout: React.FC = () => {
  const colorScheme = useColorScheme();
  const {colors} = useTheme();
  const {width, fontPixel, heightPixel, widthPixel, isMobile, isPortrait} = useResponsive();

  // Compute layout breakpoint on the client only
  const isLargeClient = useClientOnlyValue(false, !isMobile);

  // These must not depend on SSR; derive them from the client-only flag
  const drawerInitial = useClientOnlyValue(
    undefined,                                // SSR: don't decide yet
    isLargeClient ? 'open' : 'closed'         // Client: decide now
  );

  const drawerType = isLargeClient ? 'permanent' : (Platform.OS === 'web' ? 'front' : 'slide');
  const gestures = !isLargeClient;
  const segments: string[] = useSegments();
  const inDetail = (segments.includes("Units") && segments.includes("[unit_id]")) || (segments.includes("Projects") && segments.includes("[project_id]"));

  if (isMobile || isPortrait) {
    return (
      <Tabs
        screenOptions={({route}) => ({
          tabBarStyle: inDetail ? { display: 'none' } : undefined,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, false),
          tabBarIcon: (props) => {
            if (route.name === 'index') {
              return <Ionicons name='grid-outline' {...props} />;
            } else if (route.name === 'Projects') {
              return <MaterialCommunityIcons name="home-city-outline" {...props} />;
            } else if (route.name === 'Units') {
              return <UnitSVG  {...props} />;
            } else if (route.name === 'Users') {
              return <UsersSVG {...props}  />;
            } else if (route.name === 'Payments') {
              return <PaymentSVG {...props}  />;
            }
            return <TabBarIcon name="bars" {...props} />;
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Overview',
            // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Projects"
          options={{
            title: 'Projects',
            // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tabs>
    )
  }

  return (
    <Drawer
      defaultStatus={drawerInitial}
      screenOptions={({ route }) => ({
        drawerActiveTintColor: colors.brand.blue,
        drawerInactiveTintColor: Colors[colorScheme ?? 'light'].text,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        drawerItemStyle: {
          borderRadius: widthPixel(8),
        },
        drawerType,
        drawerAllowFontScaling: true,
        gestureEnabled: gestures,
        drawerIcon: (props) => {
          if (route.name === 'index') {
            return <Ionicons name='grid-outline' {...props} />;
          } else if (route.name === 'Projects') {
            return <MaterialCommunityIcons name="home-city-outline" {...props} />;
          } else if (route.name === 'Units') {
            return <UnitSVG  {...props} />;
          } else if (route.name === 'Users') {
            return <UsersSVG {...props} width={widthPixel(24)} height={heightPixel(24)} />;
          } else if (route.name === 'Payments') {
            return <PaymentSVG {...props} width={widthPixel(24)} height={heightPixel(24)} />;
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
      backBehavior='initialRoute'
      initialRouteName='index'
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Overview',
        }}
      />
      <Drawer.Screen
        name="Projects"
        options={{
          title: 'Projects',
        }}
      />
    </Drawer>
  )
}

export default Layout;