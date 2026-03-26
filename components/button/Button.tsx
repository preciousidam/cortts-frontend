import { useRoundness } from '@/styleguide/theme/Border';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/components/util';
import React, { ReactNode, forwardRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  PressableProps,
} from 'react-native';
import * as Icon from '@expo/vector-icons';

// Platform-aware linear gradient for gradient primary buttons
let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
  LinearGradient = ({ colors, start, end, style, children }: any) => {
    const angle = Math.round(
      Math.atan2(
        (end?.x ?? 1) - (start?.x ?? 0),
        (end?.y ?? 1) - (start?.y ?? 0),
      ) * (180 / Math.PI),
    );
    return (
      <View
        style={[
          style,
          // @ts-ignore — web-only CSS property
          { background: `linear-gradient(${angle}deg, ${colors.join(', ')})` },
        ]}
      >
        {children}
      </View>
    );
  };
}

export type Variant = 'primary' | 'secondary' | 'outlined' | 'tertiary';
export type Size = 'large' | 'medium' | 'small';

// New theme token classes
const variantContainerClass: Record<Variant, string> = {
  primary:  'bg-primary border-primary',
  outlined: 'bg-transparent border-primary/25',
  secondary: 'bg-transparent border-secondary/25',
  tertiary: 'bg-transparent border-transparent',
};

const variantHoverClass: Record<Variant, string> = {
  primary:  'bg-primaryBlue-normalHover',
  outlined: 'bg-surfaceContainerLow dark:bg-dark-card',
  secondary: 'bg-secondary-container/50',
  tertiary: 'bg-surfaceContainerLow dark:bg-dark-card',
};

const variantTextClass: Record<Variant, string> = {
  primary:  'text-white',
  outlined: 'text-primary',
  secondary: 'text-secondary',
  tertiary:  'text-text-default dark:text-dark-text',
};

export type IButtonProp = Omit<PressableProps, 'title' | 'children'> & {
  titleStyle?: TextStyle;
  icon?: string | ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  gradient?: boolean;
  className?: string;
  style?: ViewStyle | (ViewStyle | undefined)[];
  children?: ReactNode;
  title?: string;
  iconOnly?: boolean;
  size?: Size;
  color?: string;
};

export const Button = forwardRef<any, IButtonProp>(
  (
    {
      title = '',
      titleStyle,
      icon,
      rightIcon,
      isLoading,
      variant = 'primary',
      gradient,
      className,
      children,
      style,
      iconOnly = false,
      size = 'medium',
      ...rest
    },
    ref: React.ForwardedRef<any>,
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const styles = useStyle();
    const { fontPixel } = useResponsive();
    const shouldUseGradient = variant === 'primary' ? gradient ?? true : Boolean(gradient);

    const disabledStyle: ViewStyle = {
      backgroundColor: '#e2ddd8',
      borderColor: '#c4c6cd',
    };

    const renderLeftIcon = () => {
      if (!icon) return null;
      if (typeof icon !== 'string') return icon;
      const [iconType, name] = icon.split('.');
      const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
      if (!IconComponent) throw new Error(`Icon "${name}" not found`);
      return (
        <IconComponent
          name={name}
          size={fontPixel(size === 'small' ? 16 : 18)}
          color={rest.color ?? (rest.disabled ? '#B2B7C2' : undefined)}
        />
      );
    };

    const renderRightIcon = () => {
      if (!rightIcon) return null;
      if (typeof rightIcon !== 'string') return rightIcon;
      const [iconType, name] = (rightIcon as string).split('.');
      const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
      if (!IconComponent) throw new Error(`Icon "${name}" not found`);
      return (
        <IconComponent
          name={name}
          size={fontPixel(size === 'small' ? 16 : 14)}
          color={rest.color ?? (rest.disabled ? '#B2B7C2' : undefined)}
        />
      );
    };

    const renderLabel = (extraClass = '') => {
      const label = typeof children === 'string' ? children : title;
      return (
        <Text
          className={cn('text-center font-medium', variantTextClass[variant], extraClass)}
          style={[
            { fontSize: fontPixel(14) },
            rest.disabled ? { color: '#B2B7C2' } : undefined,
            titleStyle,
            rest.color ? { color: rest.color } : undefined,
          ]}
        >
          {label}
        </Text>
      );
    };

    const renderChildren = () => {
      if (typeof children === 'string') return renderLabel();
      return children ?? null;
    };

    // ── Icon-only variant ────────────────────────────────────────────────────
    if (iconOnly) {
      return (
        <Pressable
          className={cn(
            'items-center justify-center',
            variantContainerClass[variant],
            isHovered && variantHoverClass[variant],
            className,
          )}
          style={[
            styles.iconOnlyButton,
            { height: styles[size].height, width: styles[size].height },
            style,
            rest.disabled ? disabledStyle : undefined,
          ]}
          {...rest}
          ref={ref}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          {isLoading ? (
            <ActivityIndicator color={variant === 'primary' ? '#fff' : '#44474c'} size="small" />
          ) : (
            renderLeftIcon()
          )}
        </Pressable>
      );
    }

    // ── Gradient primary button ─────────────────────────────────────────────
    if (shouldUseGradient) {
      return (
        <Pressable
          className={cn('rounded-xl overflow-hidden', className)}
          style={[
            styles.button,
            styles[size],
            style,
            rest.disabled ? disabledStyle : undefined,
            isHovered ? { opacity: 0.9 } : undefined,
          ]}
          {...rest}
          ref={ref}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          <LinearGradient
            colors={['#000104', '#0f1d2d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
          />
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View className="flex-row items-center justify-center" style={{ columnGap: 8 }}>
              {renderLeftIcon()}
              {renderLabel('text-white')}
              {renderRightIcon()}
            </View>
          )}
        </Pressable>
      );
    }

    // ── Standard button ──────────────────────────────────────────────────────
    return (
      <Pressable
        className={cn(
          'flex-row items-center justify-center',
          variantContainerClass[variant],
          isHovered && variantHoverClass[variant],
          className,
        )}
        style={[
          styles.button,
          styles[size],
          style,
          rest.disabled ? disabledStyle : undefined,
        ]}
        {...rest}
        ref={ref}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        {!isLoading && renderLeftIcon()}
        {!isLoading && (children ? renderChildren() : renderLabel())}
        {!isLoading && renderRightIcon()}
        {isLoading && (
          <ActivityIndicator
            color={variant === 'primary' ? '#fff' : '#44474c'}
            size="small"
          />
        )}
      </Pressable>
    );
  },
);

const useStyle = () => {
  const { widthPixel, heightPixel } = useResponsive();
  const ROUNDNESS = useRoundness();
  return StyleSheet.create({
    button: {
      ...ROUNDNESS.m,
      borderWidth: widthPixel(1),
      minWidth: widthPixel(77),
      columnGap: widthPixel(8),
      paddingHorizontal: widthPixel(16),
    },
    iconOnlyButton: {
      borderRadius: widthPixel(8),
      borderWidth: widthPixel(1),
    },
    large:  { height: heightPixel(56) },
    medium: { height: heightPixel(44) },
    small:  { height: heightPixel(36) },
  });
};

// --- Button Variant Showcase (for development/testing/demo use only) ---
export const ButtonVariantsShowcase = () => {
  return (
    <View style={{ gap: 12 }}>
      <Button variant="primary">Primary Gradient</Button>
      <Button variant="primary" gradient={false}>Primary Solid</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="primary" isLoading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button
        variant="primary"
        icon={<Icon.Ionicons name="camera-outline" size={20} color="#fff" />}
        iconOnly
      />
    </View>
  );
};
