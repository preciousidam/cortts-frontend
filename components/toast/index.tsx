import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { BaseToast, InfoToast, ErrorToast, ToastProps, SuccessToast } from "react-native-toast-message";

export const toastConfig = () => {
  const { colors } = useTheme();
  const styles = useStyles();
  return {
    success: (props: ToastProps) => (
      <SuccessToast
        {...props}
        style={[styles.toastShell, { borderLeftColor: colors.successful.normal }]}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: colors.successful.darkHover }]}
        text2Style={[styles.toastText2, { color: colors.successful.normal }]}
      />
    ),
    error: (props: ToastProps) => (
      <ErrorToast
        {...props}
        style={[styles.toastShell, { borderLeftColor: colors.error.normal }]}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: colors.error.darkHover }]}
        text2Style={[styles.toastText2, { color: colors.error.normal }]}
      />
    ),
    info: (props: ToastProps) => (
      <InfoToast
        {...props}
        style={[styles.toastShell, { borderLeftColor: colors.brand.blue }]}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: colors.primaryBlue.darkHover }]}
        text2Style={[styles.toastText2, { color: colors.brand.blue }]}
      />
    ),
    warning: (props: ToastProps) => (
      <BaseToast
        {...props}
        style={[styles.toastShell, { borderLeftColor: colors.warning.normal }]}
        contentContainerStyle={styles.toastContainer}
        text1Style={[styles.toastText1, { color: colors.warning.darkHover }]}
        text2Style={[styles.toastText2, { color: colors.warning.normal }]}
      />
    ),
    default: (props: ToastProps) => (
      <BaseToast
        {...props}
        style={styles.toastShell}
        contentContainerStyle={styles.toastContainer}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
  };
}

export const useStyles = () => {
  const { colors, fonts } = useTheme();
  const { scale, fontPixel } = useResponsive();
  return {
    toastShell: {
      backgroundColor: colors.white,
      shadowColor: '#1b1c1a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    toastContainer: {
      paddingHorizontal: scale(20),
      borderRadius: 12,
    },
    toastText1: {
      fontSize: fontPixel(16),
      ...fonts.bold,
    },
    toastText2: {
      fontSize: fontPixel(16),
      ...fonts.regular,
    },
  };
}
