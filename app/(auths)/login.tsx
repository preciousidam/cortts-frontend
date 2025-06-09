import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ImageBackground } from 'expo-image';
import { BlurView } from 'expo-blur';
import { fontPixel, heightPixel, useResponsive, widthPixel } from '@/utilities/responsive';
import { Fonts } from '@/constants/Fonts';
import { ROUNDNESS } from '@/constants/Border';
import { Button } from '@/components/button';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

const web_bg = require('../../assets/images/login_web.png');
const mobile_bg = require('../../assets/images/login_mobile.png');

const Login: React.FC = () => {
  const { isPortrait } = useResponsive();

  return (
    <ImageBackground
      style={[styles.container, { paddingHorizontal: widthPixel(24), paddingVertical: heightPixel(24)}]}
      source={isPortrait ? mobile_bg : web_bg}
      contentFit='cover'
      contentPosition='center'
    >
      {isPortrait && <MobileForm />}
    </ImageBackground>
  );
};

export const MobileForm: React.FC = () => {
  const { scale, verticalScale } = useResponsive();
  const {push} = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.blurViewCont, { borderColor: '#ffffff77'}]}>
      <BlurView experimentalBlurMethod='dimezisBlurView' tint='regular'  intensity={24} style={[styles.blurView, ROUNDNESS.large, { width: scale(350), paddingHorizontal: scale(16), paddingVertical: verticalScale(24), rowGap: verticalScale(20) }]}>
        <Button
          title="Login"
          onPress={() => console.log('Login pressed')}
          color="#fff"
          style={{ width: '100%' }}
        />
        <View style={{backgroundColor: '#ffffff', width: '100%', minHeight: verticalScale(.49)}}></View>
        <Button
          title="Don't have an account? Register"
          onPress={() => push('/(auths)/register')}
          style={{ width: '100%' }}
          variant='secondary'
        />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  blurViewCont: {
    ...ROUNDNESS.large,
  }
});

export default Login;


