import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { isLt } from '@/styleguide/breakpoints';
import { LinkTypography, Typography } from '@/components/typography';
import { FormTextInput, PasswordFormInput, PhoneFormInput } from '@/components/input';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';

// Platform-aware linear gradient — same polyfill as login
let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
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
      <View style={[style, { background: `linear-gradient(${angle}deg, ${stops})` } as any]}>
        {children}
      </View>
    );
  };
}

type IForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { breakpoint, widthPixel, fontPixel, scale, verticalScale } = useResponsive();
  const { register, isLoading } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const isMobile = isLt(breakpoint, 'md');
  const isCompactDesktop = breakpoint === 'md' || breakpoint === 'lg';
  const desktopPanelPadding = scale(isCompactDesktop ? 40 : 80);
  const desktopFormPaddingX = scale(isCompactDesktop ? 40 : 72);

  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: { fullName: '', email: '', phone: '', address: '', password: '', confirmPassword: '' },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyControl = control as any;

  const onSubmit = (data: IForm) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (data.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    register({
      fullname: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  };

  // ─── Brand anchor ──────────────────────────────────────────────────────────
  const sharedLabelStyle = { textTransform: 'uppercase' as const, letterSpacing: 1.2 };

  const renderBrandAnchor = () => (
    <View style={{ rowGap: verticalScale(4) }}>
      <Typography
        variant="serifBold"
        size="headlineMd"
        className={`text-onSurface dark:text-dark-text${isMobile ? ' text-center' : ''}`}
        style={{ letterSpacing: -0.75 }}
      >
        Cortts
      </Typography>
      <Typography
        variant="medium"
        size="body"
        className={`text-onSurfaceVariant dark:text-dark-textWeak${isMobile ? ' text-center' : ''}`}
        style={{ textTransform: 'uppercase', letterSpacing: 1.4 }}
      >
        Global Portfolio Registry
      </Typography>
    </View>
  );

  // ─── Shared form content ───────────────────────────────────────────────────
  const renderFormContent = () => (
    <View style={{ rowGap: verticalScale(32) }}>
      {/* Heading */}
      <View style={{ rowGap: verticalScale(4) }}>
        <Typography variant="serifRegular" size="headlineSm" className="text-onSurface dark:text-dark-text">
          Create Account
        </Typography>
        <Typography variant="regular" size="bodyMd" className="text-onSurfaceVariant dark:text-dark-textWeak">
          Enter your details to begin your journey.
        </Typography>
      </View>

      {/* Fields */}
      <View style={{ rowGap: verticalScale(20) }}>
        {/* Full Name */}
        <FormTextInput
          name="fullName"
          control={anyControl}
          label="Full Name"
          labelStyle={sharedLabelStyle}
          inputProps={{ placeholder: 'Evelyn Thorne' }}
          style={{ width: '100%' }}
          rules={{ required: 'Full name is required' }}
        />

        {/* Email + Phone — row on web, stacked on mobile */}
        {isMobile ? (
          <>
            <FormTextInput
              name="email"
              control={anyControl}
              label="Email Address"
              labelStyle={sharedLabelStyle}
              inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'evelyn@heritage.com' }}
              style={{ width: '100%' }}
              rules={{ required: 'Email is required' }}
            />
            <PhoneFormInput
              name="phone"
              control={anyControl}
              label="Phone Number"
              labelStyle={sharedLabelStyle}
              rules={{ required: 'Phone number is required' }}
              inputProps={{ placeholder: '+1 (555) 000-0000', keyboardType: 'phone-pad' }}
              style={{ width: '100%' }}
            />
          </>
        ) : (
          <View style={{ flexDirection: 'row', columnGap: scale(16) }}>
            <View style={{ flex: 1 }}>
              <FormTextInput
                name="email"
                control={anyControl}
                label="Email Address"
                labelStyle={sharedLabelStyle}
                inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'evelyn@heritage.com', }}
                style={{ width: '100%' }}
                rules={{ required: 'Email is required' }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PhoneFormInput
                name="phone"
                control={anyControl}
                label="Phone Number"
                labelStyle={sharedLabelStyle}
                rules={{ required: 'Phone number is required' }}
                inputProps={{ placeholder: '(555) 000-0000', keyboardType: 'phone-pad' }}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        )}

        {/* Mailing Address */}
        <FormTextInput
          name="address"
          control={anyControl}
          label="Mailing Address"
          labelStyle={sharedLabelStyle}
          inputProps={{ placeholder: '123 Heritage Way, London' }}
          style={{ width: '100%' }}
        />

        {/* Password + Confirm — row on web, stacked on mobile */}
        {isMobile ? (
          <>
            <PasswordFormInput
              name="password"
              control={anyControl}
              label="Password"
              labelStyle={sharedLabelStyle}
              style={{ width: '100%' }}
              rules={{ required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } }}
            />
            <PasswordFormInput
              name="confirmPassword"
              control={anyControl}
              label="Confirm Password"
              labelStyle={sharedLabelStyle}
              style={{ width: '100%' }}
              rules={{ required: 'Please confirm your password' }}
            />
          </>
        ) : (
          <View style={{ flexDirection: 'row', columnGap: scale(16) }}>
            <View style={{ flex: 1 }}>
              <PasswordFormInput
                name="password"
                control={anyControl}
                label="Password"
                labelStyle={sharedLabelStyle}
                style={{ width: '100%' }}
                rules={{ required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PasswordFormInput
                name="confirmPassword"
                control={anyControl}
                label="Confirm Password"
                labelStyle={sharedLabelStyle}
                style={{ width: '100%' }}
                rules={{ required: 'Please confirm your password' }}
              />
            </View>
          </View>
        )}

        {/* Terms checkbox */}
        <Pressable
          className="flex-row items-start"
          style={{ columnGap: scale(10) }}
          onPress={() => setAgreeToTerms(v => !v)}
        >
          <View
            style={{
              width: widthPixel(18),
              height: widthPixel(18),
              borderRadius: widthPixel(4),
              borderWidth: 1.5,
              borderColor: agreeToTerms ? colors.secondary : colors.border,
              backgroundColor: agreeToTerms ? colors.secondary : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: verticalScale(2),
            }}
          >
            {agreeToTerms && <Ionicons name="checkmark" size={fontPixel(12)} color="#fff" />}
          </View>
          <Typography variant="regular" size="bodyMd" className="text-onSurfaceVariant dark:text-dark-textWeak flex-1">
            I agree to Estate Heritage's{' '}
            <LinkTypography href="https://cortts.com/terms" variant="regular" size="bodyMd" className="text-secondary">
              Terms of Service
            </LinkTypography>
            {' '}and{' '}
            <LinkTypography href="https://cortts.com/privacy" variant="regular" size="bodyMd" className="text-secondary">
              Privacy Policy
            </LinkTypography>
            .
          </Typography>
        </Pressable>
      </View>

      {/* CTA */}
      <Button
        gradient
        size="large"
        title={isLoading ? 'Creating Account...' : 'Create Account'}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isLoading}
        style={{ width: '100%' }}
      />

      {/* Divider + sign-in link */}
      <View style={{ rowGap: verticalScale(20) }}>
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <View className="flex-row items-center justify-center flex-wrap" style={{ columnGap: scale(4) }}>
          <Typography variant="regular" size="bodyMd" className="text-onSurfaceVariant dark:text-dark-textWeak">
            Already have an account?{' '}
          </Typography>
          <LinkTypography href="./login" variant="bold" size="bodyMd" className="text-secondary">
            Sign In
          </LinkTypography>
        </View>
      </View>
    </View>
  );

  // ─── Footer ────────────────────────────────────────────────────────────────
  const renderFooter = () => (
    <View className="items-center pt-12" style={{ rowGap: verticalScale(8), opacity: 0.4 }}>
      <Typography
        variant="regular"
        size="labelSm"
        className="text-onSurface dark:text-dark-text text-center"
        style={{ textTransform: 'uppercase', letterSpacing: 3 }}
      >
        © Estate Heritage 2024
      </Typography>
      <View className="flex-row" style={{ columnGap: scale(16) }}>
        {['Privacy', 'Terms', 'Support'].map(item => (
          <Typography
            key={item}
            variant="regular"
            size="labelSm"
            className="text-onSurface dark:text-dark-text"
            style={{ textTransform: 'uppercase', letterSpacing: 1.5 }}
          >
            {item}
          </Typography>
        ))}
      </View>
    </View>
  );

  // ─── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-background" style={{ paddingTop: top }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            className="flex-1 items-center px-6 pt-12"
            style={{
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

  // ─── Web / Tablet layout ───────────────────────────────────────────────────
  return (
    <View className="flex-1 flex-row">

      {/* Left — Editorial brand panel (always dark, theme-independent) */}
      <View
        className="overflow-hidden"
        style={{
          flexBasis: '50%',
          flexGrow: 0,
          flexShrink: 0,
          backgroundColor: '#0f1d2d',
          justifyContent: 'flex-end',
          padding: desktopPanelPadding,
        }}
      >
        {/* Estate photo at 60% opacity */}
        <View style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}>
          <Image
            source={require('../../assets/images/login_web.png')}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        </View>

        {/* Bottom-fade gradient */}
        <LinearGradient
          colors={['rgba(15,29,45,0)', colors.detail.overlay, '#0f1d2d']}
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
            style={{ textTransform: 'uppercase', letterSpacing: 2.8 }}
          >
            The Digital Concierge
          </Typography>

          <Typography variant="serifRegular" size="h1" className="text-dark-text">
            {'A legacy of\ndistinction,\nbuilt for you.'}
          </Typography>

          <Typography
            variant="regular"
            size="bodyLg"
            className="text-dark-textWeaker"
            style={{ paddingTop: verticalScale(7) }}
          >
            Join an exclusive circle of property owners and investors. Access the world's most prestigious architectural marvels.
          </Typography>

          {/* Trust indicator */}
          <View className="flex-row items-center" style={{ paddingTop: verticalScale(24), columnGap: scale(12) }}>
            <View className="flex-row">
              {['#c4a97d', '#788599', '#4a7aa8'].map((bg, i) => (
                <View
                  key={i}
                  style={{
                    width: widthPixel(32),
                    height: widthPixel(32),
                    borderRadius: widthPixel(16),
                    backgroundColor: bg,
                    borderWidth: 2,
                    borderColor: '#0f1d2d',
                    marginLeft: i === 0 ? 0 : -widthPixel(10),
                  }}
                />
              ))}
            </View>
            <Typography
              variant="semiBold"
              size="labelMd"
              className="text-dark-textWeak"
              style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
            >
              Trusted by 5,000+ Elite Homeowners
            </Typography>
          </View>
        </View>
      </View>

      {/* Right — Scrollable form panel */}
      <ScrollView
        className="bg-surface dark:bg-dark-background"
        style={{ flexBasis: '50%', flexGrow: 0, flexShrink: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="py-12"
          style={{
            width: '100%',
            maxWidth: widthPixel(isCompactDesktop ? 560 : 640),
            paddingHorizontal: desktopFormPaddingX,
            rowGap: verticalScale(40),
          }}
        >
          {renderBrandAnchor()}
          {renderFormContent()}
          {renderFooter()}
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
