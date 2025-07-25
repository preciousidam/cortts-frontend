import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRoundness } from '@/styleguide/theme/Border';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isGte, isLt } from '@/styleguide/breakpoints';
import { LinkText, Typography } from '@/components/typography';
import { FormTextInput, PasswordFormInput, PhoneFormInput } from '@/components/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { useRouter } from 'expo-router';
import { Image, ImageBackground, useImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RegisterReq } from '@/types';


const Register: React.FC = () => {

  const { isPortrait, breakpoint, widthPixel, heightPixel } = useResponsive();
  const styles = useStyles();
  const {register, isLoading, isError} = useAuth();
  const { push } = useRouter();
  const logo = useImage(require('../../assets/images/logo1.png'), {
    maxWidth: widthPixel(150),
    maxHeight: heightPixel(50),
  });

  const background = useImage(require('../../assets/images/auth_image.png'), {
    maxWidth: widthPixel(623),
    maxHeight: heightPixel(50),
  });
  const { control, handleSubmit } = useForm<RegisterReq & { confirmPassword: string }>({defaultValues: { email: '', password: '', fullname: '', phone: '', confirmPassword: '' } });

  const isMobile = isLt(breakpoint, 'md');

  const onSubmit = (data: RegisterReq & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // const formdata = new FormData();
    // formdata.append('email', data.email);
    // formdata.append('password', data.password);
    // formdata.append('fullname', data.fullname);
    // formdata.append('phone', data.phone);
    register(data);
  };

  const onError = (errors: any) => {
    console.log(errors, 'errors');
  };

  const renderForm = () => (
    <View style={styles.form}>
      {/* {isMobile && <Image source={logo} style={styles.logo} contentFit='cover' />} */}
      <View style={{ alignItems: 'flex-start', width: isMobile ? '100%' : widthPixel(422)}}>
        <Typography size='subtitle' variant='bold' style={styles.welcome}>Create your account</Typography>
        <Typography size='body'>Sign up and start your housing journey with Cortts.</Typography>
      </View>
      <View style={styles.inputArea}>
        <FormTextInput name='fullname' control={control} label='Full Name' rules={{ required: "Full Name is required" }} inputProps={{placeholder: 'Enter full name'}} />
        <FormTextInput name='email' control={control} label='Email' inputProps={{ keyboardType: 'email-address', placeholder: "Enter email" }} rules={{ required: "Email is required" }} />
        <PhoneFormInput name='phone' control={control} label='Phone Number' rules={{ required: "Phone Number is required" }} inputProps={{ placeholder: "+2348162300796", keyboardType: 'phone-pad', textContentType: 'telephoneNumber' }} />
        <PasswordFormInput name='password' control={control} label='Password' rules={{ required: "Password is required" }} />
        <PasswordFormInput name='confirmPassword' control={control} label='Confirm Password' rules={{ required: "Confirm Password is required" }} />
        <Typography>
          By clicking "Create Account", you agree to our <LinkText style={{textDecorationLine: 'underline'}} href='https://cortts.com/terms' variant='regular'>Terms of Service</LinkText> and <LinkText style={{textDecorationLine: 'underline'}} href='https://cortts.com/privacy' variant='regular'>Privacy Policy</LinkText>.
        </Typography>
      </View>
      <View style={styles.buttonArea}>
        <Button size='large' title='Create Account' onPress={handleSubmit(onSubmit, onError)} isLoading={isLoading} disabled={isLoading}></Button>
        <Typography size='body' style={{ marginTop: heightPixel(12) }}>
          Already have an account? <LinkText href='./login' variant='bold'>Sign In</LinkText>
        </Typography>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
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
    </ScrollView>
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
      paddingBottom: isLarge ? verticalScale(14) : verticalScale(0) + bottom,
    },
    welcome: {
      fontSize: fontPixel(isLarge ? 35 : 28),
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

export default Register;


