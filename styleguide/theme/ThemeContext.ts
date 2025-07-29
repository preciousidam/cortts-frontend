import { corttsLightColors } from "@/styleguide/theme/Colors";
import { Fonts } from "@/styleguide/theme/Fonts";
import { createContext, useContext } from "react";
import { ColorSchemeName, ViewStyle } from "react-native";

type Theme = "light" | "dark";

export type ThemeType = {
  theme: ColorSchemeName; // Using ColorSchemeName for better compatibility
  setTheme: (theme: Theme) => void;
  fonts: typeof Fonts;
  isDarkMode: boolean;
  isLightMode: boolean;
  colors: typeof corttsLightColors;
  shadow: (elevation: number, radius?: number) => ViewStyle;
};


const ThemeContext = createContext<ThemeType>({
  theme: "light",
  setTheme: () => {},
  fonts: Fonts,
  isDarkMode: false,
  isLightMode: true,
  colors: corttsLightColors,
  shadow: () => ({})
});

export default ThemeContext;

export const useTheme = () => useContext(ThemeContext);