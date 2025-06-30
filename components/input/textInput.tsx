import React, { useState } from 'react';
import { Text, TextInput, View, TextInputProps, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Fonts } from '@/styleguide/theme/Fonts';
import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { corttsLightColors, generateColorScale } from '@/styleguide/theme/Colors';
import * as Icon from '@expo/vector-icons';

type BaseTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  info?: string;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  leftIcon?: string | 'NGN' | React.ReactNode;
  rightIcon?: string | 'NGN' | React.ReactNode;
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
  labelStyle = {},
  leftIcon,
  rightIcon,
}) => {
  const { fontPixel, scale, verticalScale } = useResponsive();
  const { colors } = useTheme();
  const styles = useStyle();
  const ROUNDNESS = useRoundness();

  const renderLeftIcon = () => {
    if (!leftIcon) {
      return null;
    }

    if (typeof leftIcon !== 'string') {
      return leftIcon;
    }

    if (leftIcon === 'NGN') {
      return <Text style={styles.iconText}>NGN</Text>;
    }

    const iconType = leftIcon.split('.')[0];
    const name = leftIcon.split('.')[1];
    const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
    if (!IconComponent) {
      throw new Error(`Icon with name "${name}" not found`);
    }
    return <IconComponent name={name} size={fontPixel(24)} color={corttsLightColors.text} />;
  }
  
  const renderRightIcon = () => {
    if (!rightIcon) {
      return null;
    }

    if (typeof rightIcon !== 'string') {
      return rightIcon;
    }

    if (rightIcon === 'NGN') {
      return <Text style={styles.iconText}>NGN</Text>;
    }


    const iconType = rightIcon.split('.')[0];
    const name = rightIcon.split('.')[1];

    
    const IconComponent = Icon[iconType as keyof typeof Icon] as React.ComponentType<any>;
    
    if (!IconComponent) {
      throw new Error(`Icon with name "${name}" not found`);
    }
    return <IconComponent name={name} size={fontPixel(24)} color={corttsLightColors.text} />;
  }

  return (
    <View style={[style]}>
      <View style={[styles.container, { rowGap: verticalScale(8) }]}>
        {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}
        <View style={[styles.inputWrapper, ROUNDNESS.m, { borderColor: error ? colors.notification : generateColorScale(colors.neutral).light }]}>
          {leftIcon && <View style={styles.leftIconView}>{renderLeftIcon()}</View>}
          <TextInput
            onChangeText={onChangeText}
            onBlur={onBlur}
            value={value}
            {...inputProps}
            style={[styles.input, {
              paddingHorizontal: scale(16),
              minHeight: verticalScale(44),
              fontSize: fontPixel(14),
                color: colors.text,
                flex: 1,
              },
              inputProps.style,
            ]}
            placeholderTextColor={colors.textWeaker}
          />
          {rightIcon && <View style={styles.rightIconView}>{renderRightIcon()}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {info && <Text style={styles.infoText}>{info}</Text>}
      </View>
    </View>
  );
};

export const PasswordBaseInput: React.FC<BaseTextInputProps> = (props) => {
  const [secure, setSecure] = useState(true);
  const onPress = () => {
    setSecure(!secure);
  }
  return (
    <BaseTextInput 
      {...props} 
      inputProps={{ ...props.inputProps, secureTextEntry: secure }} 
      rightIcon={
        <Pressable onPress={onPress}>
          <Icon.Ionicons 
            name={secure ? 'eye-off' : 'eye'} 
            size={24} 
            color={corttsLightColors.text} 
            onPress={() => setSecure(!secure)} 
          />
        </Pressable>
      }
    />
  );
};

type FormTextInputProps = {
  name: string;
  control?: Control<any, any, any>;
  label?: string;
  rules?: object;
  inputProps?: TextInputProps;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  info?: string;
};

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  control,
  label,
  rules = {},
  inputProps,
  style,
  labelStyle,
  info,
}) => {
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
        />
      )}
    />
  );
};

export const PasswordFormInput: React.FC<FormTextInputProps> = (props) => {
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
        />
      )}
    />
  );
}

const useStyle = () => {
  const { heightPixel, fontPixel, scale, verticalScale } = useResponsive();
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      rowGap: heightPixel(8),
    },
    label: {
      fontSize: fontPixel(12),
      ...Fonts.semiBold,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
    },
    icon: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      paddingHorizontal: scale(12),
      height: heightPixel(44),
      ...Fonts.regular,
    },
    errorText: {
      color: colors.notification,
      fontSize: fontPixel(12),
      ...Fonts.regular,
    },
    infoText: {
      color: colors.neutral,
      fontSize: fontPixel(12),
    },
    leftIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopLeftRadius: verticalScale(6),
      borderBottomLeftRadius: verticalScale(6),
      borderColor: generateColorScale(colors.neutral).light,
      borderWidth: 1,
      height: heightPixel(44),
    },
    rightIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopRightRadius: verticalScale(6),
      borderBottomRightRadius: verticalScale(6),
      borderColor: generateColorScale(colors.neutral).light,
      borderWidth: 1,
      height: heightPixel(44),
    },
    iconText: {
      fontSize: fontPixel(14),
      fontFamily: Fonts.semiBold.fontFamily,
      color: corttsLightColors.text,
    },
  });
};
