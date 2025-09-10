import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useResponsive } from "@/hooks/useResponsive";
import { Stack } from "expo-router";
import React from "react";

const UserLayout: React.FC = () => {
  const {isMobile} = useResponsive();
  return <Stack screenOptions={{ headerShown: useClientOnlyValue(false, isMobile), }}>
    <Stack.Screen name="index" options={{ title: 'Users'}} />
  </Stack>;
};
export default UserLayout;