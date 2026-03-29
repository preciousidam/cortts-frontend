import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
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
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

// Platform-aware linear gradient
let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
  // Web polyfill: converts expo-linear-gradient props → CSS linear-gradient
  // Angle formula: atan2(dx, -dy) gives CSS clockwise-from-north degrees
  //   start={0,0}→end={0,1} (top→bottom) = 180deg ✓
  //   start={0,0}→end={1,1} (top-left→bottom-right) = 135deg ✓
  LinearGradient = ({ colors, locations, start, end, style, children }: any) => {
    const dx = (end?.x ?? 1) - (start?.x ?? 0);
    const dy = (end?.y ?? 1) - (start?.y ?? 0);
    const angle = Math.round(Math.atan2(dx, -dy) * (180 / Math.PI));
    const stops = (colors as string[])
      .map((c, i) =>
        locations?.[i] !== undefined ? `${c} ${Math.round(locations[i] * 100)}%` : c,
      )
      .join(', ');
    return (
      <View
        style={[
          style,
          // @ts-ignore — web-only CSS property
          { background: `linear-gradient(${angle}deg, ${stops})` },
        ]}
      >
        {children}
      </View>
    );
  };
}

type IForm = LoginReq & { remember: boolean };


const Login: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { breakpoint, widthPixel, heightPixel, fontPixel, scale, verticalScale } = useResponsive();
  const { login, isLoading, logout } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const { isDarkMode, colors } = useTheme();

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

  // ─── Brand anchor ─────────────────────────────────────────────────────────
  const renderBrandAnchor = () => (
    <View className="" style={{ rowGap: verticalScale(8) }}>
      <Typography
        variant="serifBold"
        size="headlineMd"
        className={`text-onSurface dark:text-dark-text ${isMobile ? 'text-center' : ''}`}
        style={{ letterSpacing: -0.75 }}
      >
        Cortts
      </Typography>
      <Typography
        variant="medium"
        size="bodyLg"
        className={`text-onSurfaceVariant dark:text-dark-textWeak ${isMobile ? 'text-center' : ''}`}
      >
        Real Estate Heritage
      </Typography>
    </View>
  );

  // ─── Shared form content ──────────────────────────────────────────────────
  const renderFormContent = () => (
    <View style={{ rowGap: verticalScale(32) }}>
      {/* Form Header */}
      <View style={{ rowGap: verticalScale(4) }}>
        <Typography
          variant="serifRegular"
          size="headlineSm"
          className="text-onSurface dark:text-dark-text"
        >
          Sign in to your estate
        </Typography>
        <Typography
          variant="regular"
          size="bodyMd"
          className="text-onSurfaceVariant dark:text-dark-textWeak"
        >
          Please enter your credentials to access your portfolio.
        </Typography>
      </View>

      {/* Login Form */}
      <View style={{ rowGap: verticalScale(24) }}>
        {/* Fields */}
        <View style={{ rowGap: verticalScale(20) }}>
          {/* Email */}
          <FormTextInput
            name="username"
            control={anyControl}
            label="Email Address"
            labelStyle={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
            inputProps={{
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              placeholder: 'concierge@cortts.com',
            }}
            rules={{ required: 'Email is required' }}
          />

          {/* Password with inline "Forgot Access?" in label row */}
          <View style={{ rowGap: verticalScale(8) }}>
            <View
              className="flex-row items-center justify-between"
              style={{ paddingHorizontal: scale(4) }}
            >
              <Typography
                variant="bold"
                size="labelMd"
                className="text-onSurfaceVariant dark:text-dark-textWeak"
                style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
              >
                Password
              </Typography>
              <LinkTypography
                href="./forgot-password"
                variant="bold"
                size="labelMd"
                className="text-secondary"
              >
                Forgot Access?
              </LinkTypography>
            </View>
            <PasswordFormInput
              name="password"
              control={anyControl}
              rules={{ required: 'Password is required' }}
            />
          </View>
        </View>

        {/* CTA Section */}
        <View style={{ rowGap: verticalScale(16), paddingTop: verticalScale(8) }}>
          {/* Primary CTA */}
          <Button
            gradient
            size="large"
            title="Enter Estate"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            disabled={isLoading}
            style={{ width: '100%' }}
          />

          {/* Divider */}
          <View
            className="flex-row items-center"
            style={{ columnGap: scale(16), paddingVertical: verticalScale(8) }}
          >
            <View
              className="flex-1"
              style={{ height: 1, backgroundColor: colors.border }}
            />
            <Typography
              variant="bold"
              size="labelSm"
              style={{
                color: colors.text.weaker,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              or secure access with
            </Typography>
            <View
              className="flex-1"
              style={{ height: 1, backgroundColor: colors.border }}
            />
          </View>

          {/* Google SSO */}
          <Pressable
            className="flex-row items-center justify-center rounded-xl"
            style={{
              height: heightPixel(56),
              borderWidth: 1,
              borderColor: colors.border,
              columnGap: scale(12),
            }}
          >
            <AntDesign name="google" size={fontPixel(20)} color="#4285F4" />
            <Typography
              variant="semiBold"
              size="bodyLg"
              className="text-onSurface dark:text-dark-text"
            >
              Google Account
            </Typography>
          </Pressable>
        </View>
      </View>

      {/* Bottom nav link */}
      <View
        className="flex-row items-center justify-center flex-wrap"
        style={{ paddingTop: verticalScale(32), columnGap: scale(4) }}
      >
        <Typography
          variant="regular"
          size="bodyMd"
          className="text-onSurfaceVariant dark:text-dark-textWeak"
        >
          New to Cortts?{' '}
        </Typography>
        <LinkTypography
          href="./register"
          variant="bold"
          size="bodyMd"
          className="text-secondary"
        >
          Inquire for access
        </LinkTypography>
      </View>
    </View>
  );

  // ─── Footer ───────────────────────────────────────────────────────────────
  const renderFooter = () => (
    <View className="items-center" style={{ paddingTop: verticalScale(80), opacity: 0.4 }}>
      <Typography
        variant="regular"
        size="labelSm"
        className="text-onSurface dark:text-dark-text text-center"
        style={{ textTransform: 'uppercase', letterSpacing: 3 }}
      >
        © Cortts Real Estate 2024 • Privacy & Terms
      </Typography>
    </View>
  );

  // ─── Mobile layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-background" style={{ paddingTop: top }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            className="flex-1 items-center"
            style={{
              paddingHorizontal: scale(24),
              paddingTop: verticalScale(48),
              paddingBottom: bottom + verticalScale(24),
            }}
          >
            <View style={{ width: '100%', maxWidth: 440, rowGap: verticalScale(40) }}>
              {renderBrandAnchor()}
              {renderFormContent()}
              {renderFooter()}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar />
      </View>
    );
  }

  // ─── Web / Tablet layout ──────────────────────────────────────────────────
  return (
    <View className="flex-1 flex-row">

      {/* Left — Editorial Brand Content */}
      <View
        className="flex-1 overflow-hidden"
        style={{ backgroundColor: colors.primaryBlue.normal, justifyContent: 'flex-end', padding: scale(64), width: '50%' }}
      >
        {/* Estate photo: 60% opacity */}
        <View style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}>
          <Image
            source={require('../../assets/images/login_web.png')}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        </View>

        {/* Bottom-fade gradient: transparent top → navy bottom */}
        <LinearGradient
          colors={['rgba(15,29,45,0)', colors.detail.overlay, colors.primaryBlue.normal]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { opacity: 0.8 }]}
        />

        {/* Editorial content — bottom-aligned */}
        <View style={{ maxWidth: widthPixel(512), rowGap: verticalScale(16) }}>
          <Typography
            variant="regular"
            size="labelLg"
            className="text-primary-container"
            style={{
              textTransform: 'uppercase',
              letterSpacing: 2.8,
            }}
          >
            The Digital Concierge
          </Typography>

          <Typography
            variant="serifRegular"
            size="h1"
            className="text-dark-text"
          >
            {'Securing your legacy\nin the finest\npostcodes.'}
          </Typography>

          <Typography
            variant="regular"
            size="bodyLg"
            className="text-dark-textWeaker"
            style={{
              paddingTop: verticalScale(7),
            }}
          >
            Welcome to Cortts Real Estate, where heritage meets digital precision. Manage your portfolio with the discretion and elegance it deserves.
          </Typography>
        </View>
      </View>

      {/* Right — Form panel */}
      <View
        className="flex-1 bg-surface dark:bg-dark-background items-center justify-center"
        style={{ paddingHorizontal: scale(128), paddingVertical: verticalScale(128) }}
      >
        <View style={{ width: '100%', maxWidth: 440, rowGap: verticalScale(40) }}>
          {renderBrandAnchor()}
          {renderFormContent()}
          {renderFooter()}
        </View>
      </View>
    </View>
  );
};

export default Login;
