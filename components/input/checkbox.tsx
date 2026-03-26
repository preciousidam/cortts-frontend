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
  const { colors } = useTheme();

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
        className={`items-center justify-center ${disabled ? 'bg-surfaceContainerLow border-border/20' : checked ? 'bg-primary border-primary' : 'bg-surfaceContainerLowest border-secondary/25'}`}
        style={[styles.checkbox, !checked && !disabled ? { borderColor: 'rgba(139,115,85,0.25)' } : undefined]}
      >
        {checked && <Ionicons name="checkmark" color="#fff" size={scale(14)} />}
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
      fontSize: 16,
    },
    labelDisabled: {
      fontSize: fontPixel(14),
    },
  });
};
