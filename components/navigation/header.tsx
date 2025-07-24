import { useResponsive } from "@/hooks/useResponsive";
import { generateColorScale } from "@/styleguide/theme/Colors";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseTextInput } from "../input";
import { Button } from "../button";
import { Image } from "expo-image";
import generateAvatarImage from "@/utilities/generateAvatarImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButton } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export const CustomHeader: React.FC<DrawerHeaderProps> = (props) => {
  const styles = useStyles();
  const {widthPixel, isMobile, fontPixel} = useResponsive();

  return (
    <View style={styles.container}>
      <HeaderButton onPress={props.navigation.toggleDrawer}>
        <MaterialCommunityIcons name='text' color={'#676767'} size={fontPixel(28)} />
      </HeaderButton>
      {!isMobile && <BaseTextInput inputProps={{placeholder: "Search"}} leftIcon="Ionicons.search" iconColor="#808080" style={styles.input} />}
      <View style={styles.sbs}>
        <Button iconOnly variant="tertiary" size='medium' icon="Ionicons.help-circle-outline" color={'#676767'} />
        <Button iconOnly variant="tertiary" size="medium" icon="Ionicons.notifications-outline" color={'#676767'} />
        <Button iconOnly variant="tertiary" size="medium" icon={<Image source={generateAvatarImage({name: "user name", size: widthPixel(32)})} style={styles.image} />} color={'#676767'} />
      </View>
    </View>
  );
};


const useStyles = () => {
  const {colors} = useTheme();
  const { widthPixel, heightPixel, isMobile } = useResponsive();
  const { top, bottom } = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: colors.card,
      justifyContent: 'space-between',
      paddingVertical: heightPixel(12),
      paddingHorizontal: widthPixel(isMobile ? 16 : 32),
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: heightPixel(68),
      borderBottomColor: generateColorScale(colors.neutral).lightActive,
      borderBottomWidth: heightPixel(1),
      paddingTop: top+heightPixel(12),
    },
    input: {
      width: widthPixel(545),
    },
    sbs: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      columnGap: widthPixel(12),
    },
    image: {
      width: widthPixel(32),
      height: widthPixel(32),
    }
  });
};