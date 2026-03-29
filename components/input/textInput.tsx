import React, { useState } from 'react';
import { Text, TextInput, View, TextInputProps, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Controller, Control, RegisterOptions, ValidationRule } from 'react-hook-form';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import * as Icon from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';
import { Typography } from '../typography';
import { useRoundness } from '@/styleguide/theme/Border';

type Currency = 'NGN' | 'USD';

type BaseTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  info?: string;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  className?: string;
  labelStyle?: TextStyle;
  leftIcon?: string | Currency | React.ReactNode;
  rightIcon?: string | Currency | React.ReactNode;
  iconColor?: string;
  required?: string | boolean | ValidationRule<boolean>;
};

export const BaseTextInput: React.FC<BaseTextInputProps> = ({
  value,
  onChangeText,
  onBlur,
  label,
  error,
  info,
  inputProps = {},
  style = {},
  className,
  labelStyle = {},
  leftIcon,
  rightIcon,
  iconColor,
  required,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { fontPixel, scale, verticalScale } = useResponsive();
  const styles = useStyle();
  // useTheme only for values NativeWind cannot express (JS props: placeholderTextColor, icon color)
  const { isDarkMode, colors } = useTheme();

  const placeholderColor = isDarkMode ? colors.neutral.dark : colors.neutral.normal;
  const iconTint = iconColor ?? colors.text.weak;
  const showOutline = isFocused || Boolean(error);
  const outlineColor = error
    ? colors.error.normal
    : isDarkMode
      ? colors.border
      : colors.border;

  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    if (typeof leftIcon !== 'string') return leftIcon;

    if (leftIcon === 'NGN') {
      return <Typography variant="semiBold" style={{ fontSize: fontPixel(14) }}>&#8358;</Typography>;
    }
    if (leftIcon === 'USD') {
      return <Typography variant="semiBold" style={{ fontSize: fontPixel(14) }}>&#36;</Typography>;
    }

    const [iconType, name] = leftIcon.split('.');
    const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
    if (!IconComponent) throw new Error(`Icon "${name}" not found`);
    return <IconComponent name={name} size={fontPixel(18)} color={iconTint} />;
  };

  const renderRightIcon = () => {
    if (!rightIcon) return null;
    if (typeof rightIcon !== 'string') return rightIcon;

    if (rightIcon === 'NGN') {
      return <Typography variant="semiBold" style={{ fontSize: fontPixel(14) }}>NGN</Typography>;
    }

    const [iconType, name] = rightIcon.split('.');
    const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
    if (!IconComponent) throw new Error(`Icon "${name}" not found`);
    return <IconComponent name={name} size={fontPixel(18)} color={iconTint} />;
  };

  return (
    <View style={[{ rowGap: verticalScale(8) }, style]}>
      {label && (
        <View className="flex-row" style={{ columnGap: scale(4) }}>
          {Boolean(required) && (
            <Text className="text-error-normal" style={{ fontSize: fontPixel(12) }}>*</Text>
          )}
          <Typography
            variant="semiBold"
            className={isFocused ? 'text-primaryBlue-normal dark:text-primaryBlue-light' : 'text-onSurfaceVariant dark:text-dark-textWeak'}
            style={[{ fontSize: fontPixel(12) }, labelStyle]}
          >
            {label}
          </Typography>
        </View>
      )}

      {/* Input wrapper — filled surface with subtle border in both themes */}
      <View
        className="flex-row items-center border"
        style={[
          { borderRadius: scale(6) },
          { backgroundColor: isDarkMode ? colors.card : '#f5f3f0', borderColor: outlineColor },
          showOutline ? { borderColor: error ? colors.error.normal : isDarkMode ? '#dae1e8' : '#0f1d2d' } : undefined,
        ]}
      >
        {leftIcon && (
          <View
            className="justify-center items-center"
            style={[styles.leftIconView, { backgroundColor: isDarkMode ? colors.card : '#edeeea' }]}
          >
            {renderLeftIcon()}
          </View>
        )}

        <TextInput
          onChangeText={onChangeText}
          value={value}
          {...inputProps}
          className={`font-regular flex-1${className ? ` ${className}` : ''}`}
          style={[
            styles.input,
            {
              paddingHorizontal: scale(16),
              minHeight: verticalScale(48),
              fontSize: fontPixel(14),
              color: isDarkMode ? colors.text.default : '#1b1c1a',
            },
            inputProps.style,
          ]}
          onFocus={(event) => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.();
            inputProps.onBlur?.(event);
          }}
          placeholderTextColor={placeholderColor}
        />

        {rightIcon && (
          <View
            className="justify-center items-center"
            style={[styles.rightIconView, { backgroundColor: isDarkMode ? colors.card : '#edeeea' }]}
          >
            {renderRightIcon()}
          </View>
        )}
      </View>

      {error && (
        <Typography className="text-error-normal font-regular" style={{ fontSize: fontPixel(12) }}>
          {error}
        </Typography>
      )}
      {info && (
        <Typography className="text-onSurfaceVariant dark:text-dark-textWeaker font-regular" style={{ fontSize: fontPixel(12) }}>
          {info}
        </Typography>
      )}
    </View>
  );
};

export const PasswordBaseInput: React.FC<BaseTextInputProps> = (props) => {
  const [secure, setSecure] = useState(props.inputProps?.secureTextEntry ?? true);
  const { colors } = useTheme();
  const iconColor = colors.text.default;

  return (
    <BaseTextInput
      {...props}
      inputProps={{
        ...props.inputProps,
        textContentType: 'password',
        secureTextEntry: secure,
        autoCapitalize: 'none',
      }}
      rightIcon={
        <Pressable onPress={() => setSecure(!secure)}>
          <Icon.Ionicons
            name={secure ? 'eye-off' : 'eye'}
            size={24}
            color={iconColor}
          />
        </Pressable>
      }
    />
  );
};

export const BaseTextarea: React.FC<BaseTextInputProps> = (props) => {
  const styles = useStyle();
  return (
    <BaseTextInput
      {...props}
      inputProps={{
        ...props.inputProps,
        multiline: true,
        numberOfLines: 4,
        textAlignVertical: 'top',
        style: [styles.textArea, props.inputProps?.style],
      }}
    />
  );
};

type CurrencyFormatMode = 'input' | 'blur' | 'none';

export const BaseCurrencyInput: React.FC<
  Omit<BaseTextInputProps, 'rightIcon' | 'leftIcon'> & { formatMode?: CurrencyFormatMode }
> = (props) => {
  const { formatMode = 'input', onChangeText, onBlur, value, ...rest } = props;

  const formatValue = (n: number) =>
    Number.isFinite(n) ? Intl.NumberFormat('en-NG').format(n) : '';

  const toNumericString = (text?: string | number) =>
    String(text ?? '').replace(/,/g, '').trim();

  const [display, setDisplay] = React.useState<string>('');

  React.useEffect(() => {
    const raw = toNumericString(value);
    if (raw === '') { setDisplay(''); return; }
    setDisplay(formatMode === 'input' ? formatValue(Number(raw)) : raw);
  }, [value, formatMode]);

  const handleChange = (text: string) => {
    const raw = toNumericString(text);
    setDisplay(formatMode === 'input' && raw !== '' ? formatValue(Number(raw)) : raw);
    onChangeText?.(raw);
  };

  const handleBlur = () => {
    if (formatMode === 'blur') {
      const raw = toNumericString(display);
      setDisplay(raw === '' ? '' : formatValue(Number(raw)));
    }
    onBlur?.();
  };

  return (
    <BaseTextInput
      {...rest}
      leftIcon="NGN"
      value={display}
      onChangeText={handleChange}
      onBlur={handleBlur}
      inputProps={{ keyboardType: 'numeric', ...rest.inputProps }}
    />
  );
};

export const PhoneBaseInput: React.FC<BaseTextInputProps> = (props) => {
  const countryList = {
    NG: { code: 'NG', dialCode: '+234' },
    US: { code: 'US', dialCode: '+1' },
    GB: { code: 'GB', dialCode: '+44' },
  };
  const [country, setCountry] = useState(countryList.NG);
  const { fontPixel, scale } = useResponsive();

  return (
    <BaseTextInput
      {...props}
      inputProps={{ ...props.inputProps, textContentType: 'telephoneNumber' }}
      leftIcon={
        <Pressable onPress={() => setCountry(countryList.US)}>
          <View className="flex-row items-center" style={{ gap: scale(4) }}>
            <CountryFlag isoCode={country.code} size={fontPixel(20)} />
            <Text
              className="text-text-default dark:text-dark-text"
              style={{ fontSize: fontPixel(14) }}
            >
              {country.dialCode}
            </Text>
          </View>
        </Pressable>
      }
    />
  );
};

// ── Form-connected wrappers ──────────────────────────────────────────────────

type FormTextInputProps = {
  name: string;
  control?: Control<any, any, any>;
  label?: string;
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'> | undefined;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  info?: string;
};

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name, control, label, rules = {}, inputProps, style, labelStyle, info,
}) => {
  if (!control) {
    return <BaseTextInput label={label} info={info} inputProps={inputProps} style={style} labelStyle={labelStyle} required={rules.required} />;
  }
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <BaseTextInput
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          label={label}
          error={error?.message}
          info={info}
          inputProps={inputProps}
          style={style}
          labelStyle={labelStyle}
          required={rules.required}
        />
      )}
    />
  );
};

export const FormCurrencyInput: React.FC<FormTextInputProps> = (props) => {
  if (!props.control) return <BaseCurrencyInput {...props} />;
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <BaseCurrencyInput
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          required={props.rules?.required}
        />
      )}
    />
  );
};

export const PasswordFormInput: React.FC<FormTextInputProps> = (props) => {
  if (!props.control) return <PasswordBaseInput {...props} />;
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <PasswordBaseInput
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          required={props.rules?.required}
        />
      )}
    />
  );
};

export const PhoneFormInput: React.FC<FormTextInputProps> = (props) => {
  if (!props.control) return <BaseTextInput {...props} />;
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <PhoneBaseInput
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          required={props.rules?.required}
        />
      )}
    />
  );
};

export const TextAreaFormInput: React.FC<
  FormTextInputProps & { multiline?: boolean; numberOfLines?: number }
> = (props) => {
  if (!props.control) return <BaseTextarea {...props} />;
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <BaseTextarea
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          required={props.rules?.required}
          inputProps={{
            ...props.inputProps,
            multiline: true,
            numberOfLines: props.numberOfLines || 4,
            textAlignVertical: 'top',
          }}
        />
      )}
    />
  );
};

const useStyle = () => {
  const { heightPixel, scale, verticalScale } = useResponsive();
  const ROUNDNESS = useRoundness();
  return StyleSheet.create({
    input: {
      paddingHorizontal: scale(12),
      height: heightPixel(44),
      ...ROUNDNESS.m,
    },
    leftIconView: {
      paddingHorizontal: 8,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      height: heightPixel(44),
    },
    rightIconView: {
      paddingHorizontal: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      height: heightPixel(44),
    },
    textArea: {
      height: heightPixel(100),
      textAlignVertical: 'top',
      paddingVertical: verticalScale(12),
    },
  });
};
