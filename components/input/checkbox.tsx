import { useRoundness } from '@/styleguide/theme/Border';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Typography } from '../typography';

type BaseCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  className?: string;
};

export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
  labelStyle = {},
  style,
  className,
}) => {
  const styles = useStyles();
  const { scale } = useResponsive();
  const { colors, isDarkMode } = useTheme();

  return (
    <Pressable
      className={`flex-row items-center${className ? ` ${className}` : ''}`}
      style={[{ columnGap: scale(8) }, style]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View
        className={`items-center justify-center ${disabled ? 'bg-surfaceContainerLow border-detail-divider dark:bg-dark-card dark:border-dark-border' : checked ? 'bg-primaryBlue-normal border-primaryBlue-normal dark:bg-primaryBlue-light dark:border-primaryBlue-light' : 'bg-surfaceContainerLowest border-detail-divider dark:bg-dark-card dark:border-dark-border'}`}
        style={styles.checkbox}
      >
        {checked && <Ionicons name="checkmark" color={isDarkMode ? colors.primary : '#fff'} size={scale(14)} />}
      </View>
      {label ? (
        <Typography
          className={disabled ? 'text-text-weaker dark:text-dark-textWeaker' : 'text-text-default dark:text-dark-text'}
          style={[styles.label, disabled ? styles.labelDisabled : { color: colors.text.default }, labelStyle]}
        >
          {label}
        </Typography>
      ) : null}
    </Pressable>
  );
};

type FormCheckboxProps = {
  name: string;
  control?: Control<any>;
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  className?: string;
};

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  control,
  label,
  disabled,
  labelStyle,
  style,
  className,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <BaseCheckbox
          checked={value}
          onChange={onChange}
          label={label}
          disabled={disabled}
          labelStyle={labelStyle}
          style={style}
          className={className}
        />
      )}
    />
  );
};

const BOX_SIZE = 18;

const useStyles = () => {
  const { scale, fontPixel } = useResponsive();
  const ROUNDNESS = useRoundness();

  return StyleSheet.create({
    checkbox: {
      width: scale(BOX_SIZE),
      height: scale(BOX_SIZE),
      ...ROUNDNESS.s,
      borderWidth: scale(1),
    },
    label: {
      fontSize: fontPixel(16),
    },
    labelDisabled: {
      fontSize: fontPixel(14),
    },
  });
};
