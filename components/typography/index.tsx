

import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Fonts } from '@/styleguide/theme/Fonts';
import { useResponsive } from '@/hooks/useResponsive';

type Variant = 'regular' | 'medium' | 'semiBold' | 'bold';
type Size = 'h1' | 'h2' | 'body' | 'caption';

interface AppTextProps extends TextProps {
  variant?: Variant;
  size?: Size;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const Typography: React.FC<AppTextProps> = ({
  variant = 'regular',
  size = 'body',
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const { fontPixel } = useResponsive();
  const styles = useStyles(fontPixel);

  return (
    <Text
      {...props}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        { color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const useStyles = (fontPixel: (val: number) => number) =>
  StyleSheet.create({
    base: {
      includeFontPadding: false,
    },
    regular: {
      ...Fonts.regular,
    },
    medium: {
      ...Fonts.medium,
    },
    semiBold: {
      ...Fonts.semiBold,
    },
    bold: {
      ...Fonts.bold,
    },
    h1: {
      fontSize: fontPixel(32),
    },
    h2: {
      fontSize: fontPixel(24),
    },
    body: {
      fontSize: fontPixel(16),
    },
    caption: {
      fontSize: fontPixel(12),
    },
  });