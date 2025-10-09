import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useResponsive } from "@/hooks/useResponsive";
import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: 'index',
}

const ProjectLayout: React.FC = () => {
  const {isMobile} = useResponsive();
  return <Stack screenOptions={{ headerShown: useClientOnlyValue(false, isMobile) }} />;
};

export default ProjectLayout;