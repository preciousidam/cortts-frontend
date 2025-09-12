
import { PopupComponentType } from './types';
import React, { useEffect, useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Typography } from '../typography';
import { flip, offset, useFloating } from '@floating-ui/react-native';
import { useStyles } from './style';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '../button';

export const PopupMenuV1: PopupComponentType = ({
  children,
  anchor,
  style,
  trigger = 'click',
  options = [],
  anchorVariant = 'secondary',
  ...rest
}) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState<boolean>(rest.visible || false);
  const { heightPixel, widthPixel, fontPixel } = useResponsive();
  const styles = useStyles();
  const [hoveredId, setIsHovered] = useState<number | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(heightPixel(8)), flip()],
  });

  // helper to compose handlers and close the menu
  const mergeOnPress = (childOnPress?: () => void) => () => {
    childOnPress?.();
    // onItemPress?.();      // your extra call
    setVisible(false); // (optional) close after click
  };

  useEffect(() => {
    if (rest.visible === visible) return;
    // If the visible prop changes, update the local state
    // to match it.
    setVisible(rest.visible!!);
  }, [rest.visible]);

  useEffect(() => {
    if (!visible) {
      rest.onDismiss?.();
    }
    rest.onVisibleChange?.(visible);
  }, [visible]);

  useEffect(() => {
    update();
  }, [update]);

  const isStyleArray = (style: ViewStyle | ViewStyle[]) => {
    if (Array.isArray(style)) {
      const mergedStyle = style.reduce((acc, curr) => {
        if (typeof curr === 'object') {
          return { ...acc, ...curr };
        }
        return acc;
      }, {});
      return mergedStyle;
    } else {
      // If it's not an array, just return the style as is
      if (typeof style === 'object') {
        return style;
      }
      // If it's a string or other type, we can just return an empty object
      // or handle it as needed.
      console.warn('Style should be an object or an array of objects');
      return {};
    }
  };

  const hoverBg = (destructive?: boolean) => {
    if (destructive) return styles.destroy;
    return styles.hover;
  }

  const renderOptions = () => [
    ...(React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;

      // If the child already has onPress, compose it; otherwise add one that only closes/calls onItemPress
      const childOnPress = (child.props as any)?.onPress as
        | undefined
        | (() => void);
      return React.cloneElement(child as React.ReactElement<any>, {
        onPress: mergeOnPress(childOnPress),
        style: [isStyleArray((child.props as any)?.style), rest.optionsStyle],
      });
    }) ?? []),
    ...options.map((option, index) => (
      option ? <Pressable
        {...option}
        key={index}
        style={[styles.option, rest.optionsStyle, option.style, index === hoveredId && hoverBg(option.destructive)]}
        onPress={mergeOnPress(option.onPress)}
        disabled={option.disabled}
        onPointerEnter={() => setIsHovered(index)}
        onPointerLeave={() => setIsHovered(null)}
      >
        {option.icon &&
          (!option.iconPosition || option.iconPosition === 'left') &&
          option.icon}
        <Typography
          style={[styles.optionText, index === hoveredId ? styles.hoveredText : {}, option.destructive ? styles.destroyText : {}]}
          testID={option.testID}
          accessibilityLabel={option.accessibilityLabel}
          accessibilityHint={option.accessibilityHint}
          accessibilityRole={option.accessibilityRole}
          accessibilityState={option.accessibilityState}
        >
          {option.label}
        </Typography>
        {option.icon && option.iconPosition === 'right' && option.icon}
      </Pressable> : null
    ))
  ];

  const renderAnchor = () => {
    if (typeof anchor === 'function') {
      return anchor({
        value: '',
        ref: refs.setReference,
        onPress: () => {
          if (trigger === 'click') {
            setVisible((prev) => !prev);
          }
        }
      });
    }

    return (
      <Button
        variant={anchorVariant}
        iconOnly
        icon="Ionicons.ellipsis-vertical"
        ref={(ref) => refs.setReference(ref as any)}
        onPointerEnter={() => {
          if (trigger === 'hover') {
            setVisible(true);
          }
        }}
        onPointerLeave={() => {
          if (trigger === 'hover') {
            setVisible(false);
          }
        }}
        style={[styles.button, rest.anchorStyle]}
        role="button"
        accessibilityRole="button"
        onPress={() => {
          if (trigger === 'click') {
            setVisible((prev) => !prev);
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.container, style]} {...rest}>
      <View>
        {renderAnchor()}
      </View>
      {(options.length > 0 || children) && visible && (
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card, minWidth: widthPixel(200), zIndex: 234567890 },
            rest.modalContainerStyle,
            floatingStyles as ViewStyle
          ]}
          ref={(node) => refs.setFloating?.(node as any | null)}
        >
          {renderOptions()}
        </View>
      )}
    </View>
  );
};

export default PopupMenuV1;
