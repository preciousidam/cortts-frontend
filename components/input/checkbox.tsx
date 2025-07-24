import { useRoundness } from '@/styleguide/theme/Border';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable, View, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Controller, Control } from 'react-hook-form';

type BaseCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
};

export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
  labelStyle,
  style,
}) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { scale } = useResponsive();

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={[styles.checkbox, checked && styles.checked, disabled && styles.disabled]}>
        {checked && <Ionicons name="checkmark" color={colors.card} size={scale(14)} />}
      </View>
      {label ? <Text style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>{label}</Text> : null}
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
};

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  control,
  label,
  disabled,
  labelStyle,
  style,
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
        />
      )}
    />
  );
};

const BOX_SIZE = 18;

const useStyles = () => {
  const { colors, fonts } = useTheme();
  const { scale, fontPixel } = useResponsive();
  const ROUNDNESS = useRoundness();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(8),
    },
    checkbox: {
      width: scale(BOX_SIZE),
      height: scale(BOX_SIZE),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      ...ROUNDNESS.s,
      borderColor: colors.primary + 'a2',
      borderWidth: scale(1),
    },
    checked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    disabled: {
      borderColor: '#ccc',
      backgroundColor: '#f2f2f2',
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
    labelDisabled: {
      fontSize: fontPixel(14),
      ...fonts.medium,
      color: colors.text,
    },
  });
};
