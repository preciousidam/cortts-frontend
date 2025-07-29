import { ViewStyle } from "react-native";

export const shadow = (elevation: number, radius?: number): ViewStyle => ({
  elevation,
  shadowColor: "#00000033",
  shadowOffset: {
    width: 0,
    height: elevation,
  },
  shadowOpacity: 0.3,
  shadowRadius: radius,
});