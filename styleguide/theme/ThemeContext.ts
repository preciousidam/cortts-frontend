import { colors, corttsDarkColors, corttsLightColors } from "@/styleguide/theme/Colors";
import { Fonts } from "@/styleguide/theme/Fonts";
import { createContext, useContext } from "react";
import { ColorSchemeName, ViewStyle } from "react-native";

type Theme = "light" | "dark";
type ThemeModeColors = typeof corttsLightColors & Partial<Omit<typeof corttsDarkColors, "text">>;
type RuntimeColors = typeof colors & ThemeModeColors;

export type ThemeType = {
  theme: ColorSchemeName; // Using ColorSchemeName for better compatibility
  setTheme: (theme: Theme) => void;
  fonts: typeof Fonts;
  isDarkMode: boolean;
  isLightMode: boolean;
  colors: RuntimeColors;
  shadow: (elevation: number, radius?: number) => ViewStyle;
};


const ThemeContext = createContext<ThemeType>({
  theme: "light",
  fonts: Fonts,
  isDarkMode: false,
  setTheme: () => {},
  isLightMode: true,
  colors: {...corttsLightColors, ...colors} as RuntimeColors,
  shadow: () => ({})
});

export default ThemeContext;

export const useTheme = () => useContext(ThemeContext);
