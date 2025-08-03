

import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Fonts } from '@/styleguide/theme/Fonts';
import { useResponsive } from '@/hooks/useResponsive';
import { Link, LinkProps } from 'expo-router';

type Variant = 'regular' | 'medium' | 'semiBold' | 'bold';
type Size = 'h1' | 'h2' | 'body' | 'caption' | 'subtitle';

interface AppTextProps extends TextProps {
  variant?: Variant;
  size?: Size;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  color?: string;
}

export const Typography: React.FC<AppTextProps> = ({
  variant = 'regular',
  size = 'body',
  style,
  children,
  color,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Text
      {...props}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        { color: color ?? colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const LinkTypography: React.FC<AppTextProps & LinkProps> = (Props) => {
  const styles = useStyles();
  const s: TextStyle[] = [styles.link,{ textDecorationLine: 'none' }];
  if (Array.isArray(Props.style)) {
    s.push(...(Props.style as TextStyle[]));
  } else if (Props.style) {
    s.push(Props.style);
  }

  return <Link {...Props}><Typography {...Props} style={s} /></Link>;
};

const useStyles = () => {
  const { fontPixel } = useResponsive();
  const { colors } = useTheme();
  return StyleSheet.create({
    base: {
      includeFontPadding: false,
      color: colors.text,
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
      fontSize: fontPixel(48),
    },
    h2: {
      fontSize: fontPixel(44),
    },
    body: {
      fontSize: fontPixel(14),
    },
    caption: {
      fontSize: fontPixel(12),
    },
    subtitle: {
      fontSize: fontPixel(32),
    },
    link: {
      color: colors.primary,
    }
  });
}