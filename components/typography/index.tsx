import React from 'react';
import { Platform, Text, TextProps, TextStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Link, LinkProps } from 'expo-router';

type Variant = 'regular' | 'medium' | 'semiBold' | 'bold' | 'serifRegular' | 'serifMedium' | 'serifBold';
type Size =
  | 'displayLg'
  | 'headlineLg'
  | 'headlineMd'
  | 'headlineSm'
  | 'bodyLg'
  | 'body'
  | 'bodyMd'
  | 'bodySm'
  | 'caption'
  | 'labelLg'
  | 'labelMd'
  | 'labelSm'
  | 'subtitle'
  | 'h1'
  | 'h2';

interface AppTextProps extends TextProps {
  variant?: Variant;
  size?: Size;
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  color?: string;
  className?: string;
}

const variantClassMap: Record<Variant, string> = {
  regular:      'font-regular',
  medium:       'font-medium',
  semiBold:     'font-semibold',
  bold:         'font-bold',
  serifRegular: 'font-serif',
  serifMedium:  'font-serifMedium',
  serifBold:    'font-serifBold',
};

export const Typography: React.FC<AppTextProps> = ({
  variant = 'regular',
  size = 'bodyLg',
  style,
  children,
  color,
  className: classNameProp,
  ...props
}) => {
  const { fontPixel, widthPixel, isMobile } = useResponsive();

  const sizeStyles: Record<Size, TextStyle> = {
    displayLg:  { fontSize: fontPixel(56), lineHeight: fontPixel(64) },
    headlineLg: { fontSize: fontPixel(36), lineHeight: fontPixel(44) },
    headlineMd: { fontSize: fontPixel(28), lineHeight: fontPixel(36) },
    headlineSm: { fontSize: fontPixel(24), lineHeight: fontPixel(32) },
    bodyLg:     { fontSize: fontPixel(16), lineHeight: fontPixel(24) },
    h1:       { fontSize: fontPixel(48), lineHeight: fontPixel(56) },
    h2:       { fontSize: fontPixel(44), lineHeight: fontPixel(52) },
    body:     { fontSize: fontPixel(14), lineHeight: fontPixel(20) },
    bodyMd:   { fontSize: fontPixel(14), lineHeight: fontPixel(20) },
    bodySm:   { fontSize: fontPixel(12), lineHeight: fontPixel(16) },
    caption:  { fontSize: fontPixel(12), lineHeight: fontPixel(16) },
    labelLg:  { fontSize: fontPixel(14), lineHeight: fontPixel(20) },
    labelMd:  { fontSize: fontPixel(12), lineHeight: fontPixel(16) },
    labelSm:  { fontSize: fontPixel(11), lineHeight: fontPixel(16) },
    subtitle: { fontSize: fontPixel(isMobile ? 24 : 32), lineHeight: fontPixel(isMobile ? 32 : 40) },
  };

  const inferredVariant: Variant =
    variant === 'regular' &&
    ['displayLg', 'headlineLg', 'headlineMd', 'headlineSm', 'subtitle', 'h1', 'h2'].includes(size)
      ? 'serifRegular'
      : variant;
  const isSerif = inferredVariant === 'serifRegular' || inferredVariant === 'serifMedium' || inferredVariant === 'serifBold';
  const baseStyle = sizeStyles[size];
  const fallbackLineHeight =
    baseStyle.lineHeight ??
    Math.round((baseStyle.fontSize ?? fontPixel(16)) * (isSerif ? 1.2 : 1.15));

  return (
    <Text
      {...props}
      className={`${variantClassMap[inferredVariant]} text-text-default dark:text-dark-text${classNameProp ? ` ${classNameProp}` : ''}`}
      style={[
        baseStyle,
        {
          lineHeight: fallbackLineHeight,
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
          ...(Platform.OS === 'ios' && isSerif ? { paddingTop: widthPixel(2) } : null),
        },
        color ? { color } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const LinkTypography: React.FC<AppTextProps & LinkProps> = (props) => {
  const { isDarkMode, colors } = useTheme();
  const linkColor = isDarkMode ? colors.secondary : colors.primary;

  const s: TextStyle[] = [{ textDecorationLine: 'none', color: linkColor }];
  if (Array.isArray(props.style)) {
    s.push(...(props.style as TextStyle[]));
  } else if (props.style) {
    s.push(props.style);
  }

  return (
    <Link {...props}>
      <Typography {...props} style={s} />
    </Link>
  );
};

export const LinkText = LinkTypography;
