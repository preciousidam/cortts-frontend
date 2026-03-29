import { useColorScheme } from "@/hooks/useColorScheme";
import { colors, corttsDarkColors, corttsLightColors, darkTextColors } from "@/styleguide/theme/Colors";
import { Fonts } from "@/styleguide/theme/Fonts";
import ThemeContext from "@/styleguide/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { shadow } from "./shadow";

export const AppThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const scheme = useColorScheme();
  const [{ isDarkMode, isLightMode }, setModes] = useState({
    isDarkMode: scheme === "dark",
    isLightMode: scheme === "light",
  });

  useEffect(() => {
    setModes({
      isDarkMode: scheme === "dark",
      isLightMode: scheme === "light",
    });
  }, [scheme]);

  return (
    <ThemeContext.Provider value={{
      theme: scheme,
      setTheme: () => {},
      fonts: Fonts,
      isDarkMode,
      isLightMode,
      colors: isLightMode ? {...corttsLightColors, ...colors} : {...corttsDarkColors, ...colors, text: darkTextColors},
      shadow
    }}>
      <View className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
