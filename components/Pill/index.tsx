import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Typography } from "../typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import { capitalize } from "lodash";

type Props = {
  title: string;
  style?: ViewStyle;
  className?: string;
  color: 'green' | 'yellow' | 'blue' | 'red' | 'gray';
  showIndicator?: boolean;
  rightIcon?: React.ReactNode;
}

type ColorClasses = { pill: string; text: string; indicator: string };

const colorClassMap: Record<Props['color'], ColorClasses> = {
  gray:   { pill: 'bg-secondary-fixed',      text: 'text-secondary-onFixed',                     indicator: 'bg-secondary' },
  blue:   { pill: 'bg-primaryBlue-light',    text: 'text-primaryBlue-normalHover',               indicator: 'bg-primaryBlue-normalHover' },
  red:    { pill: 'bg-error-light',          text: 'text-error-normalHover',                     indicator: 'bg-error-normalHover' },
  green:  { pill: 'bg-successful-light',     text: 'text-successful-normalHover',                indicator: 'bg-successful-normalHover' },
  yellow: { pill: 'bg-warning-light',        text: 'text-warning-normalHover',                   indicator: 'bg-warning-normalHover' },
};

export const ColoredPill: React.FC<Props> = ({ title, style, className, color = 'gray', showIndicator = true, rightIcon }) => {
  const styles = useStyles();
  const classes = colorClassMap[color];
  return (
    <View
      className={`flex-row items-center justify-center ${classes.pill}${className ? ` ${className}` : ''}`}
      style={[styles.pill, style]}
    >
      {showIndicator && <ColorIndicator color={color} />}
      <Typography className={classes.text} style={styles.text}>{capitalize(title)}</Typography>
      {rightIcon}
    </View>
  );
}

export const ColorIndicator: React.FC<Omit<Props, 'title'>> = ({ color, style, className }) => {
  const styles = useStyles();
  const classes = colorClassMap[color ?? 'gray'];
  return <View className={`${classes.indicator}${className ? ` ${className}` : ''}`} style={[styles.indicator, style]} />;
};

const useStyles = () => {
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const { circle } = useRoundness();

  return StyleSheet.create({
    text: {
      fontSize: fontPixel(12),
    },
    pill: {
      ...circle,
      columnGap: widthPixel(8),
      paddingVertical: heightPixel(8),
      paddingHorizontal: widthPixel(8),
    },
    indicator: {
      ...circle,
      width: widthPixel(8),
      height: widthPixel(8),
    },
  });
}
