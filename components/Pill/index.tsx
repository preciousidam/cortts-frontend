import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Typography } from "../typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useRoundness } from "@/styleguide/theme/Border";
import { generateColorScale } from "@/styleguide/theme/Colors";

type Props = {
  title: string;
  style?: ViewStyle;
  color: 'green' | 'yellow' | 'blue' | 'red' | 'gray'
}

export const ColoredPill: React.FC<Props> = ({ title, style, color = 'gray' }) => {
  const styles = useStyles(color)
  return (
    <View style={[styles.pill, style]}>
      <ColorIndicator color={color} />
      <Typography style={styles.text}>{title}</Typography>
    </View>
  );
}

export const ColorIndicator: React.FC<Omit<Props, 'title'>> = ({ color, style }) => {
  const styles = useStyles(color);
  return <View style={[styles.indicator, style]} />;
};

const useStyles = (variantColor: Props['color']) => {
  const { widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const { circle } = useRoundness();
  let color = colors.textWeak;
  let backgroundColor = "#E8E8E8";

  if (variantColor == 'blue'){
    color = generateColorScale(colors.primary).normalHover;
    backgroundColor = '#E6F2FA';
  } else if (variantColor == 'red') {
    color = generateColorScale(colors.notification).normalHover;
    backgroundColor = '#FCE6E6';
  } else if (variantColor == 'green') {
    color = generateColorScale(colors.success).normalHover;
    backgroundColor = '#DCFCE7';
  } else if (variantColor == 'yellow') {
    color = generateColorScale(colors.warning).normalHover;
    backgroundColor = '#FEF9C3';
  }

  return StyleSheet.create({
    text: {
      color
    },
    pill: {
      backgroundColor,
      ...circle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: widthPixel(8),
      paddingVertical: heightPixel(4),
      paddingHorizontal: widthPixel(8)
    },
    indicator : {
      backgroundColor: color,
      ...circle,
      width: widthPixel(8),
      height: widthPixel(8)
    }
  });
}