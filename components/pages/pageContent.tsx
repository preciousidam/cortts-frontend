import { useResponsive } from "@/hooks/useResponsive";
import React from "react";
import { View } from "react-native";

export const PageContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const {widthPixel} = useResponsive();
  return <View style={{ maxWidth: widthPixel(1440) }}>{children}</View>
}