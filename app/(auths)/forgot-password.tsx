import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRoundness } from '@/styleguide/theme/Border';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isGte, isLt } from '@/styleguide/breakpoints';
import { Typography } from '@/components/typography';
import { FormTextInput, OTPFormInput, PasswordFormInput } from '@/components/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ImageBackground, useImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResetPasswordReq } from '@/types';
import { Fonts } from '@/styleguide/theme/Fonts';

const ForgotPassword: React.FC = () => {
  const { step, email, code } = useLocalSearchParams<{step?: 'verification' | 'done' | 'enter_password'; email?: string; code?: string }>();
  const { breakpoint, widthPixel, heightPixel, fontPixel } = useResponsive();
  const styles = useStyles();
  const { colors } = useTheme();
  const {resetPassword, forgotPassword, isLoading, isError} = useAuth();
  const { push, setParams } = useRouter();
  const logo = useImage(require('../../assets/images/logo1.png'), {
    maxWidth: widthPixel(150),
    maxHeight: heightPixel(50),
  });

  const background = useImage(require('../../assets/images/auth_image.png'), {
    maxWidth: widthPixel(623),
    maxHeight: heightPixel(50),
  });
  const { control, handleSubmit, getValues } = useForm<ResetPasswordReq & { confirmPassword: string }>({defaultValues: { email: email ?? '', code: code ?? '', confirmPassword: '', new_password: '' } });

  const isMobile = isLt(breakpoint, 'md');

  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSubmit = ({confirmPassword, ...data}: ResetPasswordReq & { confirmPassword: string }) => {

    if (step === 'enter_password' && confirmPassword === data.new_password) {
      resetPassword(data);
    } else if (step === 'verification') {
      setParams({ step: 'enter_password', code: data.code, email: data.email ?? email });
    } else {
      forgotPassword(data);
    }
  };

  const onError = (errors: any) => {
    console.log(errors, "errors");
  };

  const renderStartForm = () => (
    <View style={styles.form}>
      {isMobile && <Image source={logo} style={styles.logo} contentFit='cover' />}
      <View style={{ alignItems: 'flex-start', width: isMobile ? '100%' : widthPixel(422)}}>
        <Typography size='subtitle' variant='bold' style={styles.welcome}>Reset Your Password</Typography>
        <Typography size='body'>Please enter your registered email address</Typography>
      </View>
      <View style={styles.inputArea}>
        <FormTextInput name='email' control={control} label='Email' inputProps={{ keyboardType: 'email-address' }} rules={{ required: "Email is required" }} />
      </View>
      <View style={styles.buttonArea}>
        <Button size='large' title='Send Reset Instructions' onPress={handleSubmit(onSubmit, onError)} isLoading={isLoading} disabled={isLoading}></Button>
      </View>
    </View>
  );

  const renderVerificationForm = () => (
    <View style={styles.form}>
      <View style={{ alignItems: 'flex-start', width: isMobile ? '100%' : widthPixel(422)}}>
        <Typography size='subtitle' variant='bold' style={styles.welcome}>Verify your account</Typography>
        <Typography size='body'>Enter the 6-digit code sent to <Typography size='body' variant='bold'>{getValues('email')}</Typography> to verify your account.</Typography>
      </View>
      <View style={styles.inputArea}>
        <OTPFormInput
          control={control}
          name='code'
        />
        <View style={styles.spaceBetween}>
          <Typography size='body' style={{ marginTop: heightPixel(12) }}>
            Code expires in <Typography style={{color: colors.primary}} variant='regular'>{formatTime(timeLeft)}</Typography>
          </Typography>
          <Typography size='body' variant='bold' style={{ alignSelf: 'flex-end', color: colors.primary }}>Resend Code</Typography>
        </View>
      </View>
      <View style={styles.buttonArea}>
        <Button size='large' title='Verify Account' onPress={handleSubmit(onSubmit, onError)} isLoading={isLoading} disabled={isLoading}></Button>
      </View>
    </View>
  );

  const renderPasswordForm = () => (
    <View style={styles.form}>
      <View style={{ alignItems: 'flex-start', width: isMobile ? '100%' : widthPixel(422)}}>
        <Typography size='subtitle' variant='bold' style={styles.welcome}>Reset Your Password</Typography>
        <Typography size='body'>Please enter your new password</Typography>
      </View>
      <View style={styles.inputArea}>
        <PasswordFormInput name='new_password' control={control} label='Password' rules={{ required: "Password is required" }} />
        <PasswordFormInput name='confirmPassword' control={control} label='Confirm Password' rules={{ required: "Confirm Password is required" }} />
      </View>
      <View style={styles.buttonArea}>
        <Button size='large' title='Verify Account' onPress={handleSubmit(onSubmit, onError)} isLoading={isLoading} disabled={isLoading}></Button>
      </View>
    </View>
  );

  const renderDone = () => (
    <View style={[styles.form, styles.roundedView]}>
      <Typography size='subtitle' variant='bold' style={[styles.welcome, { color: colors.primary }, isMobile ? { fontSize: fontPixel(28) } : { fontSize: fontPixel(35) }]}>Password Updated!</Typography>
      <Typography size='body' style={{ textAlign: 'center' }}>You have successfully reset your password! Kindly click the button below to login into your account.</Typography>
      <Button size='large' title='Back to Login' onPress={() => push({ pathname: '/(auths)/login', params: { email } })} isLoading={isLoading} disabled={isLoading} style={{ marginTop: widthPixel(20), width: '100%' }} />
    </View>
  );

  const renderForm = useMemo(() => {
    switch (step) {
      case 'verification':
        return renderVerificationForm();
      case 'enter_password':
        return renderPasswordForm();
      case 'done':
        return renderDone();
      default:
        return renderDone();
    }
  }, [step, isMobile, getValues, colors.primary, isLoading]);

  if (step === 'done') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', flex: 1}]}>
        {renderForm}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {Platform.OS != 'web' && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} contentContainerStyle={{ flex: 1 }}>
        {renderForm}
      </KeyboardAvoidingView>}
      {Platform.OS === 'web' && renderForm}
      {!isMobile && <ImageBackground source={background} style={styles.imageBg} contentFit='fill'>
        <Image source={logo} style={styles.logo_web} contentFit='cover' />
        <View>
          <Typography variant='bold' size='subtitle' style={styles.white_text}>Track your units. Upload your documents. Stay in control.</Typography>
          <Typography style={styles.white_text}>Built to keep your housing process clear, connected, and under control.</Typography>
        </View>
        <View style={styles.sbs}>
          <Typography style={styles.white_text}>Legal</Typography>
          <Typography style={styles.white_text}>Privacy Policy</Typography>
          <Typography style={styles.white_text}>Cookie Preferences</Typography>
        </View>
      </ImageBackground>}
    </View>
  );
};





const useStyles = () => {
  const { scale, verticalScale, fontPixel, breakpoint } = useResponsive();
  const { colors, fonts, dark } = useTheme();
  const isLarge = isGte(breakpoint, 'md');
  const ROUNDNESS = useRoundness();
  const { top, bottom } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      flexDirection: 'row',
      justifyContent: isLarge ? 'space-between' : 'center',
      alignItems: isLarge ? 'center' : 'flex-start',
      paddingHorizontal: scale(isLarge ? 14 : 24),
      rowGap: verticalScale(40),
      paddingVertical: isLarge ? verticalScale(14) : verticalScale(40),
    },
    welcome: {
      fontSize: fontPixel(35),
    },
    form: {
      rowGap: verticalScale(40),
      width: isLarge ? '55.88%' : '100%',
      justifyContent: 'center',
      alignItems: isLarge ? 'center' : 'flex-start',
    },
    inputArea: {
      rowGap: verticalScale(24),
      width: isLarge ? scale(422) : '100%',
    },
    buttonArea: {
      width: isLarge ? scale(422) : '100%',
    },
    logo: {
      width: scale(150),
      height: verticalScale(50),
    },
    logo_web: {
      width: scale(100),
      height: verticalScale(52),
      aspectRatio: 100 / 52,
    },
    imageBg: {
      width: scale(623),
      alignSelf: 'flex-end',
      height: '100%',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(40),
      paddingHorizontal: scale(40),
    },
    white_text: {
      color: '#ffffff',
    },
    sbs: {
      columnGap: scale(28),
      flexDirection: 'row',
    },
    spaceBetween: {
      justifyContent: 'space-between',
      width: '100%',
      flexDirection: 'row',
    },
    otptext: {
      ...Fonts.semiBold,
      color: colors.text,
      fontSize: fontPixel(32),
    },
    roundedView: {
      ...ROUNDNESS.large,
      backgroundColor: colors.card,
      paddingHorizontal: scale(isLarge ? 74 : 20),
      paddingVertical: verticalScale(48),
      width: scale(isLarge ? 570 : 366),
      justifyContent: 'center',
      alignItems: 'center',
      rowGap: verticalScale(16),
      borderColor: colors.border,
      alignSelf: 'center',
    }
  });

  return styles;
}

export default ForgotPassword;