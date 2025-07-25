
import { useRoundness } from '@/styleguide/theme/Border';
import { Fonts } from '@/styleguide/theme/Fonts';
import { useResponsive } from '@/hooks/useResponsive';
import React, { ReactNode, forwardRef, useState } from 'react';
import {
  ActivityIndicator,
  ButtonProps,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  View
} from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { generateColorScale } from '@/styleguide/theme/Colors';
import * as Icon from '@expo/vector-icons';

type Variant = 'primary' | 'secondary' | 'outlined' | 'tertiary';

type Size = 'large' | 'medium' | 'small';


const useVariantStyle = (variant: Variant) => {
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
        borderColor: generateColorScale(colors.neutral).lightActive
      } as ViewStyle;
    case 'tertiary':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent'
      } as ViewStyle;
    default:
      return {};
  }
};

const useVariantHoverStyle = (variant: Variant) => {
  const { colors } = useTheme();
  switch (variant) {
    case 'primary':
      return { backgroundColor: generateColorScale(colors.primary).normalHover };
    case 'outlined':
      return { backgroundColor: '#f4f6f8' };
    case 'secondary':
      return { backgroundColor: '#f4f6f8' };
    case 'tertiary':
      return { backgroundColor: '#f7f7f7' };
    default:
      return {};
  }
};

const useStyleText = (variant: Variant, disabled?: boolean) => {
  const { colors } = useTheme();
  switch (variant) {
    case 'primary':
      return { color: disabled ? '#B2B7C2' : '#fff' };
    case 'outlined':
      return { color: disabled  ? "#B2B7C2" : colors.primary };
    case 'secondary':
      return { color: disabled ? '#B2B7C2' : colors.textWeak };
    case 'tertiary':
      return { color: disabled ? '#B2B7C2' : colors.text };
    default:
      return { color: colors.text };
  }
};


export type IButtonProp = Omit<ButtonProps, 'title' | 'children'> & {
  titleStyle?: TextStyle;
  icon?: string | ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  children?: ReactNode;
  title?: string;
  iconOnly?: boolean;
  size?: Size;
};

export const Button: React.FC<IButtonProp> = forwardRef<
  any,
  IButtonProp
>(
  ({
    title = '',
    titleStyle,
    icon,
    rightIcon,
    isLoading,
    variant = 'primary',
    children,
    style,
    iconOnly = false,
    size = 'medium',
    ...rest
    },
    ref: React.ForwardedRef<any>
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonStyle = useVariantStyle(variant);
    const textStyle = useStyleText(variant, rest.disabled);
    const styles = useStyle();
    const { fontPixel } = useResponsive();

    const renderLeftIcon = () => {
      if (!icon) {
        return null;
      }

      if (typeof icon !== 'string') {
        return icon;
      }
      const iconType = icon.split('.')[0];
      const name = icon.split('.')[1];
      const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
      if (!IconComponent) {
        throw new Error(`Icon with name "${name}" not found`);
      }
      return <IconComponent name={name} size={fontPixel(24)} color={rest.color ?? textStyle.color} />;
    }

    const renderRightIcon = () => {
      if (!rightIcon) {
        return null;
      }

      if (typeof rightIcon !== 'string') {
        return rightIcon;
      }
      const iconType = rightIcon.split('.')[0];
      const name = rightIcon.split('.')[1];


      const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;

      if (!IconComponent) {
        throw new Error(`Icon with name "${name}" not found`);
      }
      return <IconComponent name={name} size={fontPixel(24)} color={rest.color ?? textStyle.color} />;
    }

    const renderChildren = () => {
      if (typeof children === 'string') {
        return (
          <Text
            style={[
              styles.buttonText,
              textStyle,
              titleStyle,
              rest.color ? { color: rest.color } : undefined
            ]}
          >
            {children}
          </Text>
        );
      } else {
        return children;
      }
    };

    const hoverStyle = isHovered ? useVariantHoverStyle(variant) : {};

    if (iconOnly) {
      return (
        <Pressable
          style={[
            styles.iconOnlyButton,
            buttonStyle,
            hoverStyle,
            { height: styles[size].height, width: styles[size].height },
            style,
            rest.disabled && {
              backgroundColor: '#E4E7EC',
              borderColor: variant === 'outlined' ? '#B2B7C2' : '#E4E7EC',
            },
          ]}
          {...rest}
          ref={ref}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          {isLoading ? (
            <ActivityIndicator
              color={variant === 'primary' ? '#fff' : '#222'}
              size="small"
            />
          ) : (
            renderLeftIcon()
          )}
        </Pressable>
      );
    }

    return (
      <Pressable
        style={[
          styles.button,
          buttonStyle,
          hoverStyle,
          styles[size],
          style,
          rest.disabled && {
            backgroundColor: '#E4E7EC',
            borderColor: variant === 'outlined' ? '#B2B7C2' : '#E4E7EC'
          }
        ]}
        {...rest}
        ref={ref}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        {!isLoading && renderLeftIcon()}
        {!isLoading &&
          (children ? (
            renderChildren()
          ) : (
            <Text
              disabled={rest.disabled}
              style={[
                styles.buttonText,
                textStyle,
                titleStyle,
                rest.color ? { color: rest.color } : undefined
              ]}
            >
              {title}
            </Text>
          ))}
        {!isLoading && renderRightIcon()}
        {isLoading && (
          <ActivityIndicator
            color={
              variant === 'primary'
                ? '#fff'
                : variant === 'outlined'
                ? '#222'
                : '#222'
            }
            size="small"
          />
        )}
      </Pressable>
    );
  }
);

const useStyle = () => {
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const ROUNDNESS = useRoundness();
  return StyleSheet.create({
    button: {
      ...ROUNDNESS.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: widthPixel(1),
      minWidth: widthPixel(77),
      columnGap: widthPixel(8),
      paddingHorizontal: widthPixel(16),
    },
    buttonText: {
      fontSize: fontPixel(14),
      textAlign: 'center',
      ...Fonts.medium,
    },
    iconOnlyButton: {
      width: widthPixel(44),
      height: widthPixel(44),
      borderRadius: widthPixel(8),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: widthPixel(1),
    },
    large: {
      height: heightPixel(56),
    },
    medium: {
      height: heightPixel(44),
    },
    small: {
      height: heightPixel(36),
    },
  });
};

// --- Button Variant Showcase (for development/testing/demo use only) ---

export const ButtonVariantsShowcase = () => {
  return (
    <View style={{ gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="primary" isLoading>
        Loading
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button
        variant="primary"
        icon={<Icon.Ionicons name="camera-outline" size={20} color="#fff" />}
        iconOnly
      />
    </View>
  );
};