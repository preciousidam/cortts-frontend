import React, { useMemo } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Image, Platform, Text } from 'react-native';
import { ImageBackground } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Fonts } from '@/styleguide/theme/Fonts';
import { Button } from '@/components/button';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { FormTextInput } from '@/components/input/textInput';
import { useForm } from 'react-hook-form';
import { FormCheckbox } from '@/components/input';
import { useRoundness } from '@/styleguide/theme/Border';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isGte, isLt } from '@/styleguide/breakpoints';

const web_bg = require('../../assets/images/login_web.png');
const mobile_bg = require('../../assets/images/login_mobile.png');

type IForm = {
  username: string;
  password: string;
  remember: boolean
}

type ViewProps = {
  login: (data: FormData) => void;
}

const Login: React.FC = () => {
  
  const { isPortrait, breakpoint, widthPixel, heightPixel } = useResponsive();
  const styles = useStyles();
  const {login, isLoading, isError} = useAuth();

  const image_url = useMemo(() => isLt(breakpoint, 'md') ? mobile_bg : web_bg, [breakpoint]);

  return (
    <ImageBackground
      style={[styles.container, { paddingHorizontal: widthPixel(24), paddingVertical: heightPixel(24)}]}
      source={image_url}
      contentFit='cover'
      contentPosition='center'
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {isLt(breakpoint, 'md') ? <MobileForm login={login} /> : <LargeForm  login={login} />}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};



export const MobileForm: React.FC<ViewProps> = ({ login }) => {
  
  const {dismissTo} = useRouter();
  const { colors, fonts } = useTheme();
  const { control, handleSubmit } = useForm<IForm>({defaultValues: { username: '', password: '', remember: false } });
  const styles = useStyles();
  const ROUNDNESS = useRoundness();
  const { isLoading, isError} = useAuth();

  const onSubmit = (data: IForm) => {
    console.log(data);
    const formdata = new FormData();
    formdata.append('username', data.username);
    formdata.append('password', data.password);
    login(formdata);
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
          name="username"
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
        <View style={styles.spaceBetween}>
          <FormCheckbox
            control={control}
            name='remember'
            label="Remember Me"
            labelStyle={styles.rememberText}
          />
          <Text style={styles.rememberText}>Forgot Password?</Text>
        </View>
        <Button
          title="Login"
          onPress={handleSubmit(onSubmit)}
          color="#fff"
          style={{ width: '100%' }}
          isLoading={isLoading}
        />
        <View style={styles.divider}></View>
        <Button
          title="Don't have an account? Register"
          onPress={() => dismissTo('/(auths)/register')}
          style={{ width: '100%' }}
          variant='secondary'
        />
      </BlurView>
    </View>
  );
};

export const LargeForm: React.FC<ViewProps> = ({ login }) => {
  
  const {dismissTo} = useRouter();
  const { colors, fonts } = useTheme();
  const { control, handleSubmit } = useForm<IForm>({defaultValues: { username: '', password: '', remember: false } });
  const styles = useStyles();
  const { breakpoint } = useResponsive();
  const { isLoading, isError } = useAuth();
  const isLarge = isGte(breakpoint, 'md');
  const ROUNDNESS = useRoundness();

  const onSubmit = (data: IForm) => {
    console.log(data);
    const formdata = new FormData();
    formdata.append('username', data.username);
    formdata.append('password', data.password);
    login(formdata);
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
        name="username"
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
      <View style={styles.spaceBetween}>
        <FormCheckbox
          control={control}
          name='remember'
          label="Remember Me"
          labelStyle={styles.rememberText}
        />
        <Text style={styles.rememberText}>Forgot Password?</Text>
      </View>
      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        color="#fff"
        style={{ width: '100%' }}
        isLoading={isLoading}
      />
      <View style={styles.divider}></View>
      <Button
        title="Don't have an account? Register"
        onPress={() => dismissTo('/(auths)/register')}
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

export default Login;


