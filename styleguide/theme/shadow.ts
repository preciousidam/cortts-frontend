import { ViewStyle } from "react-native";

/**
 * Ambient shadow — "natural light hitting an object."
 * Large blur, low opacity, tinted with on_surface (#1b1c1a) at 5%.
 * Token: 0 4px 32px rgba(27, 28, 26, 0.05)
 */
export const shadow = (elevation: number = 4, radius: number = 32): ViewStyle => ({
  elevation,
  shadowColor: "#1b1c1a",
  shadowOffset: {
    width: 0,
    height: elevation,
  },
  shadowOpacity: 0.05,
  shadowRadius: radius,
});
