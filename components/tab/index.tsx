import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import React from "react";
import {
    TabView,
    SceneMap,
    Route,
    SceneRendererProps,
    TabBar,
    NavigationState,
    TabDescriptor,
} from 'react-native-tab-view';

type RenderProps = SceneRendererProps & {
  route: Route};

type CustomTabProps = {
  initialIndex?: number;
  routes: Route[];
  renderScene: (props: RenderProps) => React.ReactNode;
  onIndexChange?: (index: number) => void;
};

export const CustomTab: React.FC<CustomTabProps> = ({
  initialIndex = 0,
  routes,
  renderScene,
  onIndexChange,
}) => {
  const { colors, fonts } = useTheme();
  const [index, setIndex] = React.useState(initialIndex);
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  };

  React.useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  if (!routes || routes.length === 0) {
    return null; // or some fallback UI
  }

  if (index < 0 || index >= routes.length) {
    console.warn(`Index ${index} is out of bounds for routes length ${routes.length}`);
    return null; // or some fallback UI
  }

  const scenes = SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = (props) => renderScene({ ...props, route });
      return acc;
    }, {} as Record<string, (props: RenderProps) => React.ReactNode>)
  );

  const renderTabbar = (props: SceneRendererProps & {
    navigationState: NavigationState<any>;
    options: Record<string, TabDescriptor<any>> | undefined;
}) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: colors.brand.blue }} // Customize the indicator style
        style={{ alignSelf: 'flex-start', width: 'auto', backgroundColor: colors.background, height: heightPixel(48) }} // Customize the tab bar style
        activeColor={colors.brand.blue} // Customize the active tab color
        inactiveColor={colors.text.default} // Customize the inactive tab color
        tabStyle={{ width: 'auto', paddingHorizontal: widthPixel(16), }} // Customize the tab style
        gap={widthPixel(16)} // Customize the gap between tabs
      />
    );
  };

  // Render the TabView with the provided routes and renderScene function
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={scenes}
      onIndexChange={handleIndexChange}
      renderTabBar={renderTabbar}
    />
  );
};