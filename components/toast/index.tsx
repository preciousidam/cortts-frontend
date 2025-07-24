import { useResponsive } from "@/hooks/useResponsive";
import { generateColorScale } from "@/styleguide/theme/Colors";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { BaseToast, InfoToast, ErrorToast, ToastProps, SuccessToast } from "react-native-toast-message";

export const toastConfig = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  return {
    success: (props: ToastProps) => (
      <SuccessToast
        {...props}
        style={{ borderLeftColor: colors.success }}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: generateColorScale(colors.success).darkHover }]}
        text2Style={[styles.toastText2, { color: colors.success }]}
      />
    ),
    error: (props: ToastProps) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: colors.notification }}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: generateColorScale(colors.notification).darkHover }]}
        text2Style={[styles.toastText2, { color: colors.notification }]}
      />
    ),
    info: (props: ToastProps) => (
      <InfoToast
        {...props}
        style={{ borderLeftColor: colors.primary }}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: generateColorScale(colors.primary).darkHover }]}
        text2Style={[styles.toastText2, { color: colors.primary }]}
      />
    ),
    warning: (props: ToastProps) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.warning }}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: generateColorScale(colors.warning).darkHover }]}
        text2Style={[styles.toastText2, { color: colors.warning }]}
      />
    ),
    default: (props: ToastProps) => (
      <BaseToast
        {...props}
        contentContainerStyle={styles.toastContainer}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
  };
}

export const useStyles = () => {
  const { colors, fonts } = useTheme();
  const { scale, fontPixel, verticalScale } = useResponsive();
  return {
    toastContainer: {
      paddingHorizontal: scale(20),
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    toastText1: {
      fontSize: fontPixel(16),
      ...fonts.bold
    },
    toastText2: {
      fontSize: fontPixel(16),
      ...fonts.regular
    },
  };
}