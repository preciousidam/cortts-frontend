import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Image, Platform } from 'react-native';
import { ImageBackground } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Fonts } from '@/styleguide/theme/Fonts';
import { Button } from '@/components/button';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { FormTextInput } from '@/components/input/textInput';
import { useForm } from 'react-hook-form';
import { useRoundness } from '@/styleguide/theme/Border';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isGte, isLt } from '@/styleguide/breakpoints';

const web_bg = require('../../assets/images/login_web.png');
const mobile_bg = require('../../assets/images/login_mobile.png');

const Register: React.FC = () => {
  const { isPortrait, breakpoint, widthPixel, heightPixel } = useResponsive();
  const styles = useStyles();

  return (
    <ImageBackground
      style={[styles.container, { paddingHorizontal: widthPixel(24), paddingVertical: heightPixel(24)}]}
      source={isLt(breakpoint, 'md') ? mobile_bg : web_bg}
      contentFit='cover'
      contentPosition='center'
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {isLt(breakpoint, 'md') ? <MobileForm /> : <LargeForm />}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

type IForm = {
  email: string;
  password: string;
  remember: boolean
}

export const MobileForm: React.FC = () => {
  
  const {dismissTo} = useRouter();
  const { colors, fonts } = useTheme();
  const { control, handleSubmit } = useForm<IForm>({defaultValues: { email: '', password: '', remember: false } });
  const styles = useStyles();
  const ROUNDNESS = useRoundness();
  const {register, isLoading} = useAuth();

  const onSubmit = (data: IForm) => {
    console.log(data);
    const formdata = new FormData();
    formdata.append('email', data.email);
    formdata.append('password', data.password);
    register(formdata);
  };

  return (
    <View style={[styles.blurViewCont, { borderColor: '#ffffff77'}]}>
      <BlurView experimentalBlurMethod='dimezisBlurView' tint='regular'  intensity={24} style={[styles.blurView, ROUNDNESS.large,]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo1.png')} 
            style={styles.logo}
            resizeMode='contain'
          />
        </View>
        <FormTextInput 
          name="email"
          control={control}
          label="Email"
          rules={{ required: 'Email is required' }}
          inputProps={{
            placeholder: 'Enter your email',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            style: { color: colors.card },
            placeholderTextColor: '#f9f9f9',
            cursorColor: '#ffffff',
            selectionColor: '#ffffff'
          }}
          style={styles.input}
          labelStyle={{ color: '#ffffff', ...fonts.medium }}
        />
        <FormTextInput 
          name="password"
          control={control}
          label="Password"
          rules={{ required: 'Password is required' }}
          inputProps={{
            placeholder: 'Enter your password',
            secureTextEntry: true,
            style: { color: colors.card },
            placeholderTextColor: '#f9f9f9',
            cursorColor: '#ffffff',
            selectionColor: '#ffffff'
          }}
          style={styles.input}
          labelStyle={{ color: '#ffffff', ...fonts.medium }}
        />
        <Button
          title="Register"
          onPress={handleSubmit(onSubmit)}
          color="#fff"
          style={{ width: '100%' }}
        />
        <View style={styles.divider}></View>
        <Button
          title="Already have an account? Login"
          onPress={() => dismissTo('/(auths)/login')}
          style={{ width: '100%' }}
          variant='secondary'
        />
      </BlurView>
    </View>
  );
};

export const LargeForm: React.FC = () => {
  
  const {dismissTo} = useRouter();
  const { colors, fonts } = useTheme();
  const { control, handleSubmit } = useForm<IForm>({defaultValues: { email: '', password: '', remember: false } });
  const styles = useStyles();
  const { breakpoint } = useResponsive();
  const isLarge = isGte(breakpoint, 'md');
  const ROUNDNESS = useRoundness();
  const {register, isLoading} = useAuth();

  const onSubmit = (data: IForm) => {
    console.log(data);
    const formdata = new FormData();
    formdata.append('email', data.email);
    formdata.append('password', data.password);
    register(formdata);
  };
  

  return (
    <View style={[styles.blurView, styles.blurViewCont, { borderColor: '#ffffff77'}, ROUNDNESS.large]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo1.png')} 
          style={styles.logo}
          resizeMode='contain'
        />
      </View>
      <FormTextInput 
        name="email"
        control={control}
        label="Email"
        rules={{ required: 'Email is required' }}
        inputProps={{
          placeholder: 'Enter your email',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          style: { color: isLarge ? colors.text : colors.card, backgroundColor: colors.card },
          placeholderTextColor: isLarge ? colors.text :'#f9f9f9',
          cursorColor: '#ffffff',
          selectionColor: '#ffffff',
        }}
        style={styles.input}
        labelStyle={{ color: isLarge ? colors.text : colors.card, ...fonts.medium }}
      />
      <FormTextInput 
        name="password"
        control={control}
        label="Password"
        rules={{ required: 'Password is required' }}
        inputProps={{
          placeholder: 'Enter your password',
          secureTextEntry: true,
          style: { color: isLarge ? colors.text : colors.card, backgroundColor: colors.card },
          placeholderTextColor: isLarge ? colors.text :'#f9f9f9',
          cursorColor: '#ffffff',
          selectionColor: '#ffffff'
        }}
        style={styles.input}
        labelStyle={{ color: isLarge ? colors.text : colors.card, ...fonts.medium }}
      />
      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        color="#fff"
        style={{ width: '100%' }}
      />
      <View style={styles.divider}></View>
      <Button
        title="Already have an account? Login"
        onPress={() => dismissTo('/(auths)/login')}
        style={{ width: '100%' }}
        variant='secondary'
      />
    </View>
  );
};

const useStyles = () => {
  const { scale, verticalScale, fontPixel, breakpoint } = useResponsive();
  const { colors, fonts, dark } = useTheme();
  const isLarge = isGte(breakpoint, 'md');
  const ROUNDNESS = useRoundness();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: isLarge ? 'flex-end' : 'center',
    },
    text: {
      fontSize: fontPixel(30),
      ...Fonts.medium
    },
    blurView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      overflow: 'hidden',
      borderColor: '#ffffff',
      width: scale(350), 
      paddingHorizontal: scale(16), 
      paddingVertical: verticalScale(24), 
      rowGap: verticalScale(20)
    },
    blurViewCont: {
      ...ROUNDNESS.large,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: verticalScale(2) },
      shadowOpacity: 0.25,
      shadowRadius: scale(3.84),
      elevation: 5,
      backgroundColor: isLarge ? colors.card+"E2" : undefined,
      width: isLarge ? scale(480) : undefined
    },
    input: {
      width: '100%',
    },
    divider: {backgroundColor: '#ffffff', width: '100%', minHeight: verticalScale(.49)},
    logo: { 
      width: scale(isLarge ? 140 : 120), 
      height: verticalScale(40), 
      alignSelf: 'center'
      // aspectRatio: 3.85 
    },
    logoContainer: {
      ...ROUNDNESS.m,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(24),
      backgroundColor: isLarge ? undefined : colors.card,
      paddingVertical: verticalScale(8),
    },
    spaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    rememberText: {
      fontSize: fontPixel(14),
      ...fonts.medium,
      color: isLarge ? colors.text : '#ffffff',
    },
  });

  return styles;
}

export default Register;


