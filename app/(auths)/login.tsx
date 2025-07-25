import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRoundness } from '@/styleguide/theme/Border';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isGte, isLt } from '@/styleguide/breakpoints';
import { LinkText, Typography } from '@/components/typography';
import { FormTextInput, PasswordFormInput } from '@/components/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ImageBackground, useImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginReq } from '@/types';

const web_bg = require('../../assets/images/login_web.png');
const mobile_bg = require('../../assets/images/login_mobile.png');

type IForm = LoginReq & {
  remember: boolean;
}

type ViewProps = {
  login: (data: FormData) => void;
}

const Login: React.FC = () => {
  const { email } = useLocalSearchParams<{email: string}>();
  const { isPortrait, breakpoint, widthPixel, heightPixel } = useResponsive();
  const styles = useStyles();
  const {login, isLoading, isError} = useAuth();
  const { push } = useRouter();
  const logo = useImage(require('../../assets/images/logo1.png'), {
    maxWidth: widthPixel(150),
    maxHeight: heightPixel(50),
  });

  const background = useImage(require('../../assets/images/auth_image.png'), {
    maxWidth: widthPixel(623),
    maxHeight: heightPixel(50),
  });
  const { control, handleSubmit } = useForm<IForm>({defaultValues: { username: email ?? '', password: '', remember: false } });

  const isMobile = isLt(breakpoint, 'md');

  const onSubmit = (data: IForm) => {
    const formdata = new FormData();
    formdata.append('username', data.username);
    formdata.append('password', data.password);
    login(formdata);
  };

  const onError = (errors: any) => {
    console.log(errors, 'errors');
  };

  const renderForm = () => (
    <View style={styles.form}>
      {isMobile && <Image source={logo} style={styles.logo} contentFit='cover' />}
      <View style={{ alignItems: 'flex-start', width: isMobile ? '100%' : widthPixel(422)}}>
        <Typography size='subtitle' variant='bold' style={styles.welcome}>Welcome Back!</Typography>
        <Typography size='body'>Please enter your login details to access your account</Typography>
      </View>
      <View style={styles.inputArea}>
        <FormTextInput name='username' control={control} label='Email' inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none' }} rules={{ required: "Email is required" }} />
        <PasswordFormInput name='password' control={control} label='Password' rules={{ required: "Password is required" }} />
        <LinkText href='./forgot-password' size='body' variant='bold' style={{ alignSelf: 'flex-end' }}>Forgot Password?</LinkText>
      </View>
      <View style={styles.buttonArea}>
        <Button size='large' title='Login' onPress={handleSubmit(onSubmit, onError)} isLoading={isLoading} disabled={isLoading}></Button>
        <Typography size='body' style={{ marginTop: heightPixel(12) }}>
          Don't have an account? <LinkText href='./register' variant='bold'>Sign Up</LinkText>
        </Typography>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS != 'web' && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} contentContainerStyle={{ flex: 1 }}>
        {renderForm()}
      </KeyboardAvoidingView>}
      {Platform.OS === 'web' && renderForm()}
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
      paddingVertical: isLarge ? verticalScale(14) : verticalScale(40) + top,
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
  });

  return styles;
}

export default Login;


