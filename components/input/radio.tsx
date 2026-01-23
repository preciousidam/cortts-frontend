import { useRoundness } from '@/styleguide/theme/Border';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Controller, Control, ValidationRule, RegisterOptions } from 'react-hook-form';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Typography } from '../typography';

type RadioProps = {
  selected: boolean;
  onChange: (selected: boolean) => void;
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
};

const Radio: React.FC<RadioProps> = ({
  selected,
  onChange,
  label,
  disabled,
  labelStyle = {},
  style,
}) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { scale } = useResponsive();

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => !disabled && onChange(!selected)}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
    >
      <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} color={selected ? colors.brand.blue : colors.neutral.lightActive} size={scale(20)} />
      {label ? <Typography style={[styles.label, disabled ? styles.labelDisabled : {}, labelStyle]}>{label}</Typography> : null}
    </Pressable>
  );
};

export type BaseRadioProps<T> = {
  selected?: T;
  onSelect?: (selected: T) => void;
  options: { label: string; value: T }[];
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
  layout?: 'horizontal' | 'vertical';
  required?: string | boolean | ValidationRule<boolean>;
  listStyle?: ViewStyle;
};

export const BaseRadioButton = <T, >({
  selected,
  onSelect,
  options,
  label,
  disabled = false,
  labelStyle = {},
  style,
  layout = 'horizontal',
  required = false,
  listStyle = {}
}: BaseRadioProps<T>) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const handleSelect = (value: T) => {
    if (disabled) return;
    onSelect?.(value);
  };

  return (
    <View style={[styles.buttonGroup, style]}>
      {label && <View style={styles.sb}>
        {Boolean(required) && <Text style={styles.required}>*</Text>}
        <Typography variant='semiBold' size="caption" style={[styles.label, { color: colors.text.default }, labelStyle]}>{label}</Typography>
      </View>}
      <View style={[layout === 'vertical' ? styles.vertical : styles.horizontal, listStyle]}>
        {options.map((option) => (
          <Radio
            key={option.value as string}
            selected={selected === option.value}
            onChange={() => handleSelect(option.value)}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}

type FormRadioProps<T> = {
  name: string;
  control?: Control<any>;
  label?: string;
  disabled?: boolean;
  labelStyle?: TextStyle;
  options: { label: string; value: T }[];
  selected?: T;
  onSelect?: (value: T) => void;
  style?: ViewStyle;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
};

export const FormRadioButton = <T,>({
  name,
  control,
  label,
  disabled,
  labelStyle,
  rules,
  style,
  options,
  selected,
  onSelect,
}: FormRadioProps<T>) => {
  if (!control) {
    console.warn("FormRadioButton requires a control prop from react-hook-form");
    return <BaseRadioButton
      selected={selected}
      onSelect={onSelect}
      options={options}
      label={label}
      disabled={disabled}
      labelStyle={labelStyle}
      style={style}
    />;
  }
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <BaseRadioButton<T>
          onSelect={onChange}
          label={label}
          disabled={disabled}
          labelStyle={labelStyle}
          style={style}
          selected={value}
          options={options}
          required={rules?.required} // Adjust as needed
        />
      )}
    />
  );
};

const BOX_SIZE = 18;

const useStyles = () => {
  const { colors, fonts } = useTheme();
  const { scale, fontPixel, verticalScale } = useResponsive();
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
      borderColor: colors.brand.blue + 'a2',
      borderWidth: scale(1),
    },
    checked: {
      backgroundColor: colors.brand.blue,
      borderColor: colors.brand.blue,
    },
    disabled: {
      borderColor: '#ccc',
      backgroundColor: '#f2f2f2',
    },
    label: {
      
    },
    labelDisabled: {
     
    },
    horizontal: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(24),
    },
    vertical: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      rowGap: verticalScale(24),
    },
    sb: {
      columnGap: scale(4),
      flexDirection: 'row',
    },
    required: {
      color: colors.error.normal,
      fontSize: fontPixel(12),
    },
    buttonGroup: {
      rowGap: verticalScale(12),
    },
  });
};
