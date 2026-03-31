import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Controller, Control, ValidationRule, RegisterOptions } from 'react-hook-form';
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
  const { scale } = useResponsive();
  const { colors, isDarkMode } = useTheme();

  return (
    <Pressable
      className="flex-row items-center"
      style={[{ columnGap: scale(8) }, style]}
      onPress={() => !disabled && onChange(!selected)}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
    >
      <Ionicons
        name={selected ? "radio-button-on" : "radio-button-off"}
        color={selected ? (isDarkMode ? '#dae1e8' : '#0f1d2d') : colors.border}
        size={scale(20)}
      />
      {label ? <Typography className="text-text-default dark:text-dark-text" style={labelStyle}>{label}</Typography> : null}
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
  className?: string;
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
  className,
  layout = 'horizontal',
  required = false,
  listStyle = {}
}: BaseRadioProps<T>) => {
  const styles = useStyles();

  const handleSelect = (value: T) => {
    if (disabled) return;
    onSelect?.(value);
  };

  return (
    <View className={className} style={[styles.buttonGroup, style]}>
      {label && (
        <View className="flex-row" style={{ columnGap: styles.sb.columnGap }}>
          {Boolean(required) && (
            <Text className="text-error-normal" style={{ fontSize: styles.required.fontSize }}>*</Text>
          )}
          <Typography variant='semiBold' size="caption" style={labelStyle}>{label}</Typography>
        </View>
      )}
      <View
        className={layout === 'vertical' ? 'flex-col items-start' : 'flex-row items-center'}
        style={[layout === 'vertical' ? styles.vertical : styles.horizontal, listStyle]}
      >
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
  className?: string;
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
  className,
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
      className={className}
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
          className={className}
          selected={value}
          options={options}
          required={rules?.required}
        />
      )}
    />
  );
};

const useStyles = () => {
  const { scale, fontPixel, verticalScale } = useResponsive();

  return StyleSheet.create({
    horizontal: {
      columnGap: scale(24),
    },
    vertical: {
      rowGap: verticalScale(24),
    },
    sb: {
      columnGap: scale(4),
    },
    required: {
      fontSize: fontPixel(12),
    },
    buttonGroup: {
      rowGap: verticalScale(12),
    },
  });
};
