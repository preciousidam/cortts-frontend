import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Typography } from "../typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useRoundness } from "@/styleguide/theme/Border";
import { capitalize } from "lodash";

type Props = {
  title: string;
  style?: ViewStyle;
  color: 'green' | 'yellow' | 'blue' | 'red' | 'gray';
  showIndicator?: boolean;
  rightIcon?: React.ReactNode;
}

export const ColoredPill: React.FC<Props> = ({ title, style, color = 'gray', showIndicator = true, rightIcon }) => {
  const styles = useStyles(color);
  return (
    <View style={[styles.pill, style]}>
      {showIndicator && <ColorIndicator color={color} />}
      <Typography style={styles.text}>{capitalize(title)}</Typography>
      {rightIcon}
    </View>
  );
}

export const ColorIndicator: React.FC<Omit<Props, 'title'>> = ({ color, style }) => {
  const styles = useStyles(color);
  return <View style={[styles.indicator, style]} />;
};

const useStyles = (variantColor: Props['color']) => {
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const { colors } = useTheme();
  const { circle } = useRoundness();
  let color = colors.text.weak;
  let backgroundColor = "#E8E8E8";

  if (variantColor == 'blue'){
    color = colors.primaryBlue.normalHover;
    backgroundColor = '#E6F2FA';
  } else if (variantColor == 'red') {
    color = colors.error.normalHover;
    backgroundColor = '#FCE6E6';
  } else if (variantColor == 'green') {
    color = colors.successful.normalHover;
    backgroundColor = '#DCFCE7';
  } else if (variantColor == 'yellow') {
    color = colors.warning.normalHover;
    backgroundColor = '#FEF9C3';
  }

  return StyleSheet.create({
    text: {
      color,
      fontSize: fontPixel(12)
    },
    pill: {
      backgroundColor,
      ...circle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: widthPixel(8),
      paddingVertical: heightPixel(8),
      paddingHorizontal: widthPixel(8),
    },
    indicator : {
      backgroundColor: color,
      ...circle,
      width: widthPixel(8),
      height: widthPixel(8)
    }
  });
}