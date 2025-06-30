import { corttsLightColors } from "@/styleguide/theme/Colors";
import { Fonts } from "@/styleguide/theme/Fonts";
import { createContext, useContext } from "react";
import { ColorSchemeName } from "react-native";

type Theme = "light" | "dark";

export type ThemeType = { 
  theme: ColorSchemeName; // Using ColorSchemeName for better compatibility
  setTheme: (theme: Theme) => void;
  fonts: typeof Fonts;
  isDarkMode: boolean;
  isLightMode: boolean;
  colors: typeof corttsLightColors;
};


const ThemeContext = createContext<ThemeType>({
  theme: "light",
  setTheme: () => {},
  fonts: Fonts,
  isDarkMode: false,
  isLightMode: true,
  colors: corttsLightColors,
});

export default ThemeContext;

export const useTheme = () => useContext(ThemeContext);