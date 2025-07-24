import { useResponsive } from '@/hooks/useResponsive';
import { Fonts } from '@/styleguide/theme/Fonts';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { OtpInput, OtpInputProps } from "react-native-otp-entry";

type BaseTextInputProps = OtpInputProps & {
  error?: boolean | string;
}

export const OTPBaseInput: React.FC<BaseTextInputProps> = (props) => {
  const { colors } = useTheme();
  const { heightPixel, fontPixel } = useResponsive();
  const styles = useStyles();

  return (
    <OtpInput
      {...props}
      numberOfDigits={6}
      type='numeric'
      focusColor={colors.primary}
      textInputProps={{
        accessibilityLabel: "One-Time Password",
        textContentType: "oneTimeCode",
        autoComplete: "one-time-code",
        keyboardType: "number-pad",
      }}
      textProps={{ style: [styles.otptext, Boolean(props.error) && styles.error] }}
      theme={{
        pinCodeContainerStyle: Boolean(props.error) ? {borderColor: colors.notification} : {},
        focusedPinCodeContainerStyle: Boolean(props.error) ? {borderColor: colors.notification} : {},
      }}
    />
  );
};

type FormTextInputProps = BaseTextInputProps & {
  name: string;
  control?: Control<any, any, any>;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
};

export const OTPFormInput: React.FC<FormTextInputProps> = ({control, name, rules, ...props}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur }, fieldState: { error } }) => (
        <OTPBaseInput
          {...props}
          onTextChange={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
};



const useStyles = () => {
  const { scale, verticalScale, fontPixel, breakpoint } = useResponsive();
  const { colors, fonts, dark } = useTheme();

  const styles = StyleSheet.create({
    otptext: {
      ...Fonts.semiBold,
      color: colors.text,
      fontSize: fontPixel(32),
    },
    error: {
      color: colors.notification
    }
  });

  return styles;
}