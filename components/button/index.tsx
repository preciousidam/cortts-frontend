import { ROUNDNESS } from '@/constants/Border';
import { Fonts } from '@/constants/Fonts';
import { fontPixel, heightPixel, useResponsive, widthPixel } from '@/utilities/responsive';
import { useTheme } from '@react-navigation/native';
import React, { ReactNode, forwardRef } from 'react';
import {
  ActivityIndicator,
  ButtonProps,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'outlined' | 'tertiary';

const useStyle = (variant: Variant) => {
  const { colors } = useTheme();
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary
      } as ViewStyle;
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.primary
      } as ViewStyle;
    case 'secondary':
      return {
        backgroundColor: colors.card,
        borderColor: colors.card
      } as ViewStyle;
    case 'tertiary':
      return {
        backgroundColor: '#F3F3F5',
        borderColor: colors.card
      } as ViewStyle;
  }
};

const useStyleText = (variant: Variant, disabled?: boolean) => {
  const { colors } = useTheme();
  switch (variant) {
    case 'primary':
      return {color: disabled ? '#B2B7C2' : colors.text};
    case 'outlined':
    case 'secondary':
    case 'tertiary':
      return {color: disabled ? '#B2B7C2' : colors.text}
  }
};


export type IButtonProp = ButtonProps & {
  titleStyle?: TextStyle;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  children?: ReactNode;
};

export const Button: React.FC<IButtonProp> = forwardRef<
  any,
  IButtonProp
>(
  (
    {
      title = '',
      titleStyle,
      icon,
      rightIcon,
      isLoading,
      variant = 'primary',
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const { colors, fonts } = useTheme();
    const { scale, verticalScale } = useResponsive();
    const buttonStyle = useStyle(variant);
    const textStyle = useStyleText(variant, rest.disabled);
    const renderChildren = () => {
      if (typeof children == 'string') {
        return (
          <Text
            style={[styles.buttonText, textStyle, titleStyle, {color: rest.color}]}
          >
            {children}
          </Text>
        );
      } else {
        return children;
      }
    };
    return (
      <Pressable style={[styles.button, buttonStyle, style, rest.disabled && {
        backgroundColor: '#E4E7EC',
        borderColor: variant == 'outlined' ? '#B2B7C2' : '#E4E7EC'
      }]} {...rest} ref={ref}>
        {!isLoading && icon}
        {!isLoading &&
          (children ? (
            renderChildren()
          ) : (
            <Text
              disabled={rest.disabled}
              style={[styles.buttonText, textStyle, titleStyle, {color: rest.color ?? colors.text}]}
            >
              {title}
            </Text>
          ))}
        {!isLoading && rightIcon}
        {isLoading && <ActivityIndicator color="#ffffff" size="small" />}
      </Pressable>
    );
  }
);

export const styles = StyleSheet.create({
  button: {
    ...ROUNDNESS.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: widthPixel(1),
    minWidth: widthPixel(168),
    paddingVertical: heightPixel(16),
    paddingHorizontal: widthPixel(16),
    columnGap: widthPixel(8)
  },
  buttonText: {
    fontSize: fontPixel(16),
    textAlign: 'center',
    ...Fonts.bold,
  }
});