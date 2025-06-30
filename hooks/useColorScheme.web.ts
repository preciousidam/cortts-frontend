// NOTE: The default React Native styling doesn't support server rendering.
// Server rendered styles should not change between the first render of the HTML
// and the first render on the client. Typically, web developers will use CSS media queries
// to render different styles on the client and server, these aren't directly supported in React Native

import { useEffect, useState } from "react";
import { ColorSchemeName, Platform } from "react-native";

// but can be achieved using a styling library like Nativewind.
export const useColorScheme = (): ColorSchemeName => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light');

  useEffect(() => {
    if (Platform.OS === 'web' && window.matchMedia) {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light');
      };
      setColorScheme(matcher.matches ? 'dark' : 'light');
      matcher.addEventListener('change', listener);

      return () => matcher.removeEventListener('change', listener);
    }
  }, []);

  return colorScheme;
};
