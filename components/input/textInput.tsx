import React, { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View, TextInputProps, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Controller, Control, RegisterOptions, ValidationRule } from 'react-hook-form';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import * as Icon from '@expo/vector-icons';
import { Typography } from '../typography';
import PhoneCountrySelector, { PhoneCountry } from './PhoneCountrySelector';

type Currency = 'NGN' | 'USD';

const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'NG', dialCode: '+234', name: 'Nigeria' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
  { code: 'CA', dialCode: '+1', name: 'Canada' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa' },
  { code: 'GH', dialCode: '+233', name: 'Ghana' },
  { code: 'KE', dialCode: '+254', name: 'Kenya' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates' },
  { code: 'FR', dialCode: '+33', name: 'France' },
  { code: 'DE', dialCode: '+49', name: 'Germany' },
  { code: 'IT', dialCode: '+39', name: 'Italy' },
  { code: 'ES', dialCode: '+34', name: 'Spain' },
  { code: 'PT', dialCode: '+351', name: 'Portugal' },
  { code: 'NL', dialCode: '+31', name: 'Netherlands' },
  { code: 'IN', dialCode: '+91', name: 'India' },
];

type BaseTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  labelRight?: React.ReactNode;
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
  labelRight,
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
    : 'transparent';

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
    <View style={[{ rowGap: verticalScale(8), width: '100%' }, style]}>
      {label && (
        <View className="flex-row items-center justify-between" style={{ columnGap: scale(8) }}>
          <View className="flex-row items-center" style={{ columnGap: scale(4) }}>
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
          {labelRight ? <View>{labelRight}</View> : null}
        </View>
      )}

      {/* Input wrapper — filled surface with subtle border in both themes */}
      <View
        className="flex-row items-center border"
        style={[
          { borderRadius: scale(8), minHeight: verticalScale(48), overflow: 'hidden' },
          { backgroundColor: isDarkMode ? colors.card : '#f2f0ed', borderColor: outlineColor },
          showOutline ? { borderColor: error ? colors.error.normal : isDarkMode ? '#dae1e8' : '#0f1d2d' } : undefined,
        ]}
      >
        {leftIcon && (
          <View
            className="justify-center items-center"
            style={styles.leftIconView}
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
              paddingVertical: 0,
              fontSize: fontPixel(14),
              color: isDarkMode ? colors.text.default : '#6b7280',
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
            style={styles.rightIconView}
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
  const iconColor = colors.text.weaker;

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
            size={16}
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
  const detectCountry = (rawValue?: string) =>
    PHONE_COUNTRIES.find((country) => rawValue?.startsWith(country.dialCode)) ?? PHONE_COUNTRIES[0];

  const stripDialCode = (rawValue: string | undefined, country: PhoneCountry) => {
    if (!rawValue) return '';
    if (rawValue.startsWith(country.dialCode)) {
      return rawValue.slice(country.dialCode.length).trimStart();
    }
    return rawValue;
  };

  const [country, setCountry] = useState<PhoneCountry>(() => detectCountry(props.value));

  useEffect(() => {
    if (!props.value || props.value.startsWith(country.dialCode)) return;
    const detected = detectCountry(props.value);
    if (detected.code !== country.code) {
      setCountry(detected);
    }
  }, [props.value, country]);

  const localValue = useMemo(() => stripDialCode(props.value, country), [props.value, country]);

  const handleCountrySelect = (nextCountry: PhoneCountry) => {
    setCountry(nextCountry);
    const stripped = stripDialCode(props.value, country).trim();
    props.onChangeText?.(stripped ? `${nextCountry.dialCode} ${stripped}` : '');
  };

  const handlePhoneChange = (text: string) => {
    const normalized = text.trimStart();
    props.onChangeText?.(normalized ? `${country.dialCode} ${normalized}` : '');
  };

  return (
    <BaseTextInput
      {...props}
      value={localValue}
      onChangeText={handlePhoneChange}
      inputProps={{ ...props.inputProps, textContentType: 'telephoneNumber' }}
      leftIcon={
        <PhoneCountrySelector
          countries={PHONE_COUNTRIES}
          selectedCountry={country}
          onSelect={handleCountrySelect}
        />
      }
    />
  );
};

// ── Form-connected wrappers ──────────────────────────────────────────────────

type FormTextInputProps = {
  name: string;
  control?: Control<any, any, any>;
  label?: string;
  labelRight?: React.ReactNode;
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'> | undefined;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  info?: string;
};

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name, control, label, labelRight, rules = {}, inputProps, style, labelStyle, info,
}) => {
  if (!control) {
    return <BaseTextInput label={label} labelRight={labelRight} info={info} inputProps={inputProps} style={style} labelStyle={labelStyle} required={rules.required} />;
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
          labelRight={labelRight}
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
  if (!props.control) return <PhoneBaseInput {...props} />;
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
  const { scale, verticalScale } = useResponsive();
  return StyleSheet.create({
    input: {
      paddingHorizontal: scale(12),
      flex: 1,
      alignSelf: 'stretch',
    },
    leftIconView: {
      paddingLeft: scale(16),
      paddingRight: scale(16),
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
    rightIconView: {
      paddingLeft: scale(16),
      paddingRight: scale(16),
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
    textArea: {
      height: verticalScale(100),
      textAlignVertical: 'top',
      paddingVertical: verticalScale(12),
    },
  });
};
