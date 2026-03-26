import { useResponsive } from "@/hooks/useResponsive";
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
import { useProfileQueries } from "@/store/users/queries";


export const CustomHeader: React.FC<DrawerHeaderProps> = (props) => {
  const styles = useStyles();
  const {widthPixel, isMobile, fontPixel} = useResponsive();
  const { fullname, email } = useProfileQueries();

  return (
    <View
      className="w-full flex-row items-center justify-between bg-surfaceContainerLow dark:bg-dark-card"
      style={styles.container}
    >
      {isMobile && <HeaderButton onPress={props.navigation.toggleDrawer}>
        <MaterialCommunityIcons name='text' color={'#676767'} size={fontPixel(28)} />
      </HeaderButton>}
      {!isMobile && <BaseTextInput inputProps={{placeholder: "Search"}} leftIcon="Ionicons.search" iconColor="#808080" style={styles.input} />}
      <View className="flex-row items-center" style={styles.sbs}>
        <Button iconOnly variant="tertiary" size='medium' icon="Ionicons.help-circle-outline" color={'#676767'} />
        <Button iconOnly variant="tertiary" size="medium" icon="Ionicons.notifications-outline" color={'#676767'} />
        <Button iconOnly variant="tertiary" size="medium" icon={<Image source={generateAvatarImage({name: fullname ?? '', size: widthPixel(32)})} style={styles.image} />} color={'#676767'} />
      </View>
    </View>
  );
};


const useStyles = () => {
  const { widthPixel, heightPixel, isMobile } = useResponsive();
  const { top } = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      paddingVertical: heightPixel(12),
      paddingHorizontal: widthPixel(isMobile ? 16 : 32),
      minHeight: heightPixel(68),
      paddingTop: top + heightPixel(12),
      shadowColor: '#1b1c1a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    input: {
      width: widthPixel(545),
    },
    sbs: {
      columnGap: widthPixel(12),
    },
    image: {
      width: widthPixel(32),
      height: widthPixel(32),
    }
  });
};
