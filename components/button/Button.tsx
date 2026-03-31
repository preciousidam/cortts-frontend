import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/components/util';
import { useTheme } from '@/styleguide/theme/ThemeContext';
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
  primary:  'bg-primaryBlue-normal border-primaryBlue-normal dark:bg-primaryBlue-light dark:border-primaryBlue-light',
  outlined: 'bg-transparent border-detail-divider dark:border-dark-border',
  secondary: 'bg-surfaceContainerLow border-detail-divider dark:bg-dark-card dark:border-dark-border',
  tertiary: 'bg-transparent border-transparent',
};

const variantHoverClass: Record<Variant, string> = {
  primary:  'bg-primaryBlue-normalHover dark:bg-primaryBlue-lightHover',
  outlined: 'bg-detail-interactive dark:bg-detail-interactiveDark',
  secondary: 'bg-neutral-lightActive dark:bg-detail-dividerDark',
  tertiary: 'bg-detail-interactive dark:bg-detail-interactiveDark',
};

const variantTextClass: Record<Variant, string> = {
  primary:  'text-white dark:text-primaryBlue-normal',
  outlined: 'text-text-weak dark:text-dark-textWeak',
  secondary: 'text-text-weak dark:text-dark-textWeak',
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
    const { fontPixel, widthPixel } = useResponsive();
    const { isDarkMode, colors } = useTheme();
    const shouldUseGradient = Boolean(gradient);
    const gradientColors = isDarkMode
      ? [colors.primaryBlue.light, colors.primaryBlue.lightActive]
      : [colors.text.default, colors.primaryBlue.normal];
    const gradientLabelClass = isDarkMode ? 'text-primaryBlue-normal' : 'text-white';

    const disabledStyle: ViewStyle = {
      backgroundColor: '#e6e8e9',
      borderColor: '#e6e8e9',
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
            { fontSize: fontPixel(14), lineHeight: fontPixel(20) },
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
          className={cn('overflow-hidden', className)}
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
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: styles.button.borderRadius }]}
          />
          {isLoading ? (
            <ActivityIndicator color={isDarkMode ? colors.primaryBlue.normal : '#ffffff'} size="small" />
          ) : (
            <View className="flex-1 flex-row items-center justify-center" style={{ columnGap: widthPixel(8) }}>
              {renderLeftIcon()}
              {renderLabel(gradientLabelClass)}
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
  return StyleSheet.create({
    button: {
      borderRadius: widthPixel(12),
      borderWidth: widthPixel(1),
      minWidth: widthPixel(77),
      columnGap: widthPixel(8),
      paddingHorizontal: widthPixel(16),
    },
    iconOnlyButton: {
      borderRadius: widthPixel(12),
      borderWidth: widthPixel(1),
    },
    large:  { height: heightPixel(56) },
    medium: { height: heightPixel(44) },
    small:  { height: heightPixel(36) },
  });
};

// --- Button Variant Showcase (for development/testing/demo use only) ---
export const ButtonVariantsShowcase = () => {
  const { widthPixel } = useResponsive();
  return (
    <View style={{ gap: widthPixel(12) }}>
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
