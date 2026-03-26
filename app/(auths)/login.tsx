import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { isLt } from '@/styleguide/breakpoints';
import { LinkTypography, Typography } from '@/components/typography';
import { FormTextInput, PasswordFormInput } from '@/components/input';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginReq } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

// Platform-aware linear gradient
let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
  LinearGradient = ({ colors, start, end, style, children }: any) => {
    const angle = Math.round(
      Math.atan2(
        (end?.x ?? 1) - (start?.x ?? 0),
        (end?.y ?? 1) - (start?.y ?? 0),
      ) * (180 / Math.PI),
    );
    return (
      <View
        style={[
          style,
          // @ts-ignore — web-only CSS property
          { background: `linear-gradient(${angle}deg, ${colors.join(', ')})` },
        ]}
      >
        {children}
      </View>
    );
  };
}

type IForm = LoginReq & { remember: boolean };

const CHIPS_WEB = [
  { icon: 'home-outline',     label: 'Residential' },
  { icon: 'business-outline', label: 'Commercial' },
  { icon: 'layers-outline',   label: 'Mixed-Use' },
] as const;

const CHIPS_MOBILE = ['Residential', 'Commercial'] as const;

const Login: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { breakpoint, widthPixel, heightPixel, fontPixel, scale, verticalScale } = useResponsive();
  const { login, isLoading } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  // useTheme only for JS-required values (icon colors, shadow, overlay rgba)
  const { isDarkMode } = useTheme();

  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: { username: email ?? '', password: '', remember: false },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyControl = control as any;
  const isMobile = isLt(breakpoint, 'md');

  const onSubmit = (data: IForm) => {
    const formdata = new FormData();
    formdata.append('username', data.username);
    formdata.append('password', data.password);
    login(formdata);
  };

  // ─── Shared form card ───────────────────────────────────────────────────────
  const renderForm = () => (
    <View
      className="w-full bg-card dark:bg-dark-card rounded-xl"
      style={{
        paddingVertical: verticalScale(32),
        paddingHorizontal: scale(28),
        rowGap: verticalScale(24),
        // Ambient shadow: useTheme not needed — token is always the same
        shadowColor: '#1b1c1a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 32,
        elevation: 4,
      }}
    >
      {/* Heading */}
      <View style={{ rowGap: verticalScale(6) }}>
        <Typography
          variant="serifMedium"
          className="text-onSurface dark:text-dark-text"
          style={{ fontSize: fontPixel(28), lineHeight: fontPixel(36) }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="regular"
          className="text-onSurfaceVariant dark:text-dark-textWeak"
          style={{ fontSize: fontPixel(14), lineHeight: fontPixel(20) }}
        >
          Sign in to continue managing your properties.
        </Typography>
      </View>

      {/* Fields */}
      <View style={{ rowGap: verticalScale(16) }}>
        <FormTextInput
          name="username"
          control={anyControl}
          label="Email address"
          inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none' }}
          rules={{ required: 'Email is required' }}
        />
        <PasswordFormInput
          name="password"
          control={anyControl}
          label="Password"
          rules={{ required: 'Password is required' }}
        />
        <LinkTypography
          href="./forgot-password"
          variant="medium"
          className="self-end text-secondary"
        >
          Forgot password?
        </LinkTypography>
      </View>

      {/* Primary CTA — gradient Button */}
      <Button
        gradient
        size="large"
        title="Log in"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isLoading}
        style={{ width: '100%' }}
      />

      {/* Sign up */}
      <View
        className="items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: isDarkMode ? 'rgba(196,198,205,0.2)' : 'rgba(196,198,205,0.35)' }}
      >
        <Typography
          variant="regular"
          className="text-onSurfaceVariant dark:text-dark-textWeak"
          style={{ fontSize: fontPixel(14) }}
        >
          Don't have an account?{' '}
          <LinkTypography href="./register" variant="semiBold">
            Sign up
          </LinkTypography>
        </Typography>
      </View>
    </View>
  );

  // ─── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <View className="flex-1 bg-background dark:bg-dark-background" style={{ paddingTop: top }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Logo bar */}
          <View
            className="flex-row items-center"
            style={{ paddingHorizontal: scale(24), paddingVertical: verticalScale(16) }}
          >
            <Image
              source={require('../../assets/images/logo1.png')}
              style={{ width: widthPixel(88), height: heightPixel(30) }}
              contentFit="contain"
            />
          </View>

          {/* Hero illustration — pixel-perfect height, rounded corners */}
          <View
            className="overflow-hidden rounded-xl"
            style={{ marginHorizontal: scale(20), height: heightPixel(220) }}
          >
            <Image
              source={require('../../assets/images/login_mobile.png')}
              className="w-full h-full"
              contentFit="cover"
            />
            {/* Soft bottom fade into page background */}
            <LinearGradient
              colors={[
                isDarkMode ? 'rgba(13,17,23,0)' : 'rgba(251,249,246,0)',
                isDarkMode ? 'rgba(13,17,23,0.65)' : 'rgba(251,249,246,0.65)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { top: '50%' }]}
            />
            {/* Category chips */}
            <View
              className="flex-row absolute gap-2"
              style={{ top: scale(14), left: scale(14) }}
            >
              {CHIPS_MOBILE.map((label) => (
                <View
                  key={label}
                  className="rounded-full border border-white/25 bg-white/15"
                  style={{ paddingHorizontal: scale(12), paddingVertical: verticalScale(4) }}
                >
                  <Typography
                    variant="medium"
                    className="text-white"
                    style={{ fontSize: fontPixel(11) }}
                  >
                    {label}
                  </Typography>
                </View>
              ))}
            </View>
          </View>

          {/* Form */}
          <View
            style={{
              paddingHorizontal: scale(20),
              paddingTop: verticalScale(20),
              paddingBottom: bottom + verticalScale(24),
            }}
          >
            {renderForm()}
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar />
      </View>
    );
  }

  // ─── Web / Tablet layout ────────────────────────────────────────────────────
  return (
    <View className="flex-1 flex-row bg-background dark:bg-dark-background">

      {/* Left — illustration panel (always dark-on-image, no dark mode variation) */}
      <View className="flex-1 overflow-hidden">
        <Image
          source={require('../../assets/images/login_web.png')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        {/* Ink navy gradient overlay for legibility */}
        <LinearGradient
          colors={['rgba(15,29,45,0.72)', 'rgba(15,29,45,0.18)', 'rgba(15,29,45,0.72)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          className="flex-1 justify-between"
          style={{
            paddingHorizontal: widthPixel(48),
            paddingBottom: heightPixel(56),
            paddingTop: top + heightPixel(40),
          }}
        >
          {/* Top: logo + support link */}
          <View className="flex-row items-center justify-between">
            <Image
              source={require('../../assets/images/logo1.png')}
              style={{ width: widthPixel(110), height: heightPixel(36) }}
              contentFit="contain"
              tintColor="#ffffff"
            />
            <View className="flex-row items-center" style={{ columnGap: scale(6) }}>
              {/* useTheme not needed — icon color is always white (on-image context) */}
              <Ionicons name="help-circle-outline" size={fontPixel(16)} color="rgba(255,255,255,0.75)" />
              <Typography
                variant="regular"
                style={{ color: 'rgba(255,255,255,0.75)', fontSize: fontPixel(13) }}
              >
                Need help?{'  '}
              </Typography>
              <Typography
                variant="semiBold"
                className="text-white"
                style={{ fontSize: fontPixel(13) }}
              >
                Contact support
              </Typography>
            </View>
          </View>

          {/* Bottom: chips + headline + tagline */}
          <View style={{ rowGap: verticalScale(20) }}>
            {/* Property chips */}
            <View className="flex-row flex-wrap" style={{ gap: scale(8) }}>
              {CHIPS_WEB.map(({ icon, label }) => (
                <View
                  key={label}
                  className="flex-row items-center rounded-full bg-white/15 border border-white/25"
                  style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(5),
                    columnGap: scale(5),
                  }}
                >
                  <Ionicons name={icon as any} size={fontPixel(12)} color="rgba(255,255,255,0.85)" />
                  <Typography
                    variant="medium"
                    style={{ color: 'rgba(255,255,255,0.9)', fontSize: fontPixel(12) }}
                  >
                    {label}
                  </Typography>
                </View>
              ))}
            </View>

            <Typography
              variant="serifMedium"
              className="text-white"
              style={{ fontSize: fontPixel(40), lineHeight: fontPixel(52), maxWidth: widthPixel(500) }}
            >
              Manage your portfolio with confidence.
            </Typography>

            <Typography
              variant="regular"
              style={{ color: 'rgba(255,255,255,0.75)', fontSize: fontPixel(15), lineHeight: fontPixel(22) }}
            >
              Built for modern real estate professionals.
            </Typography>
          </View>
        </View>
      </View>

      {/* Right — form panel */}
      <View
        className="items-center justify-center bg-background dark:bg-dark-background"
        style={{ width: widthPixel(480), paddingHorizontal: scale(40) }}
      >
        {renderForm()}
      </View>
    </View>
  );
};

export default Login;
