import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import generateAvatarImage from "@/utilities/generateAvatarImage";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../typography";
import { Button } from "../button";
import { useAuth } from "@/contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfileQueries } from "@/store/users/queries";

export const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const styles = useStyles();
  const { push } = useRouter();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { fullname, email } = useProfileQueries();
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo1.png')} style={styles.logo} contentFit="contain" />
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.bottom}>
        <DrawerItem {...props} labelStyle={styles.label} label="Settings" onPress={() => push("/Settings")} icon={props => <Ionicons name="settings-outline" {...props} color={colors.text} />} />
        <View style={styles.sbs}>
          <Image source={{ uri: generateAvatarImage({ name: fullname ?? '', color: '101928' }) }} style={styles.image} />
          <View style={[{ flex: 1 }, styles.vertSpace]}>
            <Typography variant="semiBold" size="body" style={styles.name}>{fullname}</Typography>
            <Typography variant="regular" size="body" style={styles.email} numberOfLines={1}>{email}</Typography>
          </View>
          <Button iconOnly variant="tertiary" size="small" onPress={logout} icon="MaterialIcons.login" color={'#676767'} />
        </View>
      </View>
    </View>
  );
};

const useStyles = () => {
  const { widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
      justifyContent: 'space-between',
      rowGap: heightPixel(24),
      paddingTop: top,
      paddingBottom: bottom
    },
    scroll: {
      borderBottomColor: colors.border,
      borderBottomWidth: widthPixel(1),
    },
    item: {
      marginVertical: heightPixel(8),
    },
    bottom: {
      rowGap: heightPixel(30),
    },
    label: {
      fontSize: widthPixel(14),
      color: colors.text,
    },
    image: {
      width: widthPixel(40),
      height: widthPixel(40),
    },
    sbs: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: widthPixel(12),
      columnGap: widthPixel(12),
    },
    name: {
      fontSize: widthPixel(14),
    },
    email: {
      fontSize: widthPixel(14),
      color: "#475367"
    },
    vertSpace: {
      rowGap: heightPixel(4),
    },
    logo: {
      height: heightPixel(40.3),
      alignSelf: 'flex-start',
      width: widthPixel(155),
    }
  });
};
