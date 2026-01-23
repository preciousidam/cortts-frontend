import { useResponsive } from "@/hooks/useResponsive";
import React from "react";
import { View, ViewStyle } from "react-native";

export const PageContent: React.FC<{children: React.ReactNode, style?: ViewStyle}> = ({ children, style }) => {
  const {widthPixel} = useResponsive();
  return <View style={[{ maxWidth: widthPixel(1440), flex: 1 }, style]}>{children}</View>
}