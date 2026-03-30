import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { isLt } from '@/styleguide/breakpoints';
import { Typography } from '@/components/typography';
import { FormTextInput, OTPFormInput, PasswordFormInput } from '@/components/input';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResetPasswordReq } from '@/types';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Platform-aware linear gradient — same polyfill as login/register
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

type ForgotPasswordStep = 'verification' | 'enter_password' | 'done';
type FormValues = ResetPasswordReq & { confirmPassword: string };

const ForgotPassword: React.FC = () => {
  const params = useLocalSearchParams<{ step?: ForgotPasswordStep; email?: string; code?: string }>();
  const { breakpoint, widthPixel, fontPixel, scale, verticalScale } = useResponsive();
  const { forgotPassword, resetPassword, isLoading } = useAuth();
  const { colors } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { push, replace, setParams } = useRouter();

  const isMobile = isLt(breakpoint, 'md');
  const currentStep = params.step;
  const inputLabelStyle = { textTransform: 'uppercase' as const, letterSpacing: 1.2 };

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      email: params.email ?? '',
      code: params.code ?? '',
      new_password: '',
      confirmPassword: '',
    },
  });

  const anyControl = control as any;
  const watchedEmail = watch('email');
  const resolvedEmail = watchedEmail || params.email || '';
  const resolvedCode = params.code || watch('code') || '';

  const [timeLeft, setTimeLeft] = React.useState(300);

  React.useEffect(() => {
    if (currentStep !== 'verification') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const onSubmit = (data: FormValues) => {
    if (currentStep === 'verification') {
      setParams({ step: 'enter_password', email: data.email || resolvedEmail, code: data.code });
      return;
    }
    if (currentStep === 'enter_password') {
      if (data.new_password !== data.confirmPassword) {
        Toast.show({ text1: 'Passwords do not match', text2: 'Please ensure both passwords are the same.', type: 'error' });
        return;
      }
      resetPassword({ email: data.email || resolvedEmail, code: data.code || resolvedCode, new_password: data.new_password });
      return;
    }
    forgotPassword({ email: data.email });
  };

  const onResendCode = () => {
    if (!resolvedEmail) return;
    forgotPassword({ email: resolvedEmail });
    setTimeLeft(300);
  };

  if ((currentStep === 'verification' || currentStep === 'enter_password') && !resolvedEmail) {
    return <Redirect href='/(auths)/login' />;
  }

  // ─── Shared section header ─────────────────────────────────────────────────
  const renderHeader = (title: string, subtitle: React.ReactNode) => (
    <View style={{ rowGap: verticalScale(12) }}>
      <Typography variant="serifBold" size="headlineSm" className="text-onSurface dark:text-dark-text">
        {title}
      </Typography>
      {typeof subtitle === 'string' ? (
        <Typography variant="regular" size="bodyLg" className="text-onSurfaceVariant dark:text-dark-textWeak">
          {subtitle}
        </Typography>
      ) : subtitle}
    </View>
  );

  const renderPrimaryCTA = (label: string, onPress: () => void) => (
    <Button
      gradient
      size="large"
      title={label}
      onPress={onPress}
      isLoading={isLoading}
      disabled={isLoading}
      style={{ width: '100%' }}
    />
  );

  // ─── Step: initial email entry (matches Figma node 35-290) ─────────────────
  const renderStartStep = () => (
    <View style={{ rowGap: verticalScale(40) }}>
      {renderHeader(
        'Forgot Password',
        'Please enter the email address associated with your account. We will send you a secure link to reset your credentials.',
      )}

      <View style={{ rowGap: verticalScale(40) }}>
        {/* Email field — label rendered separately per Figma, icon via labelRight */}
        <FormTextInput
          name="email"
          control={anyControl}
          label="Email Address"
          labelStyle={{ textTransform: 'uppercase', letterSpacing: 1.2, color: colors.secondary }}
          inputProps={{
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            placeholder: 'e.g. james.ellington@luxury.com',
            
          }}
          rules={{ required: 'Email is required' }}
        />

        {renderPrimaryCTA(isLoading ? 'Sending...' : 'Send Reset Link', handleSubmit(onSubmit))}
      </View>

      {/* Divider + Back to Login */}
      <View style={{ rowGap: verticalScale(24) }}>
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Pressable
          onPress={() => push('/(auths)/login')}
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: scale(8) }}
        >
          <Ionicons name="arrow-back" size={fontPixel(14)} color={colors.secondary} />
          <Typography variant="semiBold" size="bodyMd" className="text-secondary">
            Back to Login
          </Typography>
        </Pressable>
      </View>
    </View>
  );

  // ─── Step: OTP verification ────────────────────────────────────────────────
  const renderVerificationStep = () => (
    <View style={{ rowGap: verticalScale(32) }}>
      <Pressable
        onPress={() => replace('/(auths)/forgot-password')}
        style={{ flexDirection: 'row', alignItems: 'center', columnGap: scale(8) }}
      >
        <Ionicons name="arrow-back" size={fontPixel(14)} color={colors.secondary} />
        <Typography variant="semiBold" size="bodyMd" className="text-secondary">
          Back to email
        </Typography>
      </Pressable>

      {renderHeader(
        'Check your email',
        <Typography variant="regular" size="bodyLg" className="text-onSurfaceVariant dark:text-dark-textWeak">
          Enter the 6-digit code sent to{' '}
          <Typography variant="semiBold" size="bodyLg" className="text-onSurface dark:text-dark-text">
            {resolvedEmail}
          </Typography>.
        </Typography>,
      )}

      <View style={{ rowGap: verticalScale(20) }}>
        <OTPFormInput control={anyControl} name="code" />

        <View className="flex-row items-center justify-between">
          <Typography variant="regular" size="bodySm" className="text-onSurfaceVariant dark:text-dark-textWeak">
            Expires in{' '}
            <Typography variant="semiBold" size="bodySm" className="text-secondary">{formatTime(timeLeft)}</Typography>
          </Typography>
          <Pressable onPress={onResendCode}>
            <Typography variant="semiBold" size="bodySm" className="text-secondary">Resend code</Typography>
          </Pressable>
        </View>

        {renderPrimaryCTA(isLoading ? 'Verifying...' : 'Verify Code', handleSubmit(onSubmit))}
      </View>
    </View>
  );

  // ─── Step: new password — matches Figma node 35-341 ──────────────────────
  const renderResetStep = () => (
    <View style={{ rowGap: verticalScale(40) }}>
      {/* Header */}
      {renderHeader(
        'Reset Password',
        'Please establish your new security credentials to regain access to your exclusive portfolio.',
      )}

      {/* Form */}
      <View style={{ rowGap: verticalScale(24) }}>
        <PasswordFormInput
          name="new_password"
          control={anyControl}
          label="New Password"
          labelStyle={inputLabelStyle}
          rules={{ required: 'Password is required' }}
        />
        <PasswordFormInput
          name="confirmPassword"
          control={anyControl}
          label="Confirm New Password"
          labelStyle={inputLabelStyle}
          rules={{ required: 'Please confirm your password' }}
        />
      </View>

      {/* CTA */}
      {renderPrimaryCTA(isLoading ? 'Updating...' : 'Update Password', handleSubmit(onSubmit))}

      {/* Back to login — centered, ink navy per Figma */}
      <View className="items-center" style={{ paddingVertical: verticalScale(8) }}>
        <Pressable
          onPress={() => push('/(auths)/login')}
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: scale(8) }}
        >
          <Ionicons name="arrow-back" size={fontPixel(12)} color={colors.primaryBlue.normal} />
          <Typography variant="semiBold" size="bodyMd" className="text-onSurface dark:text-dark-text">
            Back to secure login
          </Typography>
        </Pressable>
      </View>

      {/* Ghost divider + centered copyright */}
      <View style={{ rowGap: verticalScale(24) }}>
        <View style={{ height: 1, backgroundColor: 'rgba(196,198,205,0.3)' }} />
        <Typography
          variant="regular"
          size="labelSm"
          className="text-onSurfaceVariant dark:text-dark-textWeak text-center"
          style={{ textTransform: 'uppercase', letterSpacing: 2, opacity: 0.6 }}
        >
          Cortts Realty Group © 2024
        </Typography>
      </View>
    </View>
  );

  // ─── Step: success ────────────────────────────────────────────────────────
  const renderDoneStep = () => (
    <View style={{ rowGap: verticalScale(24) }}>
      {renderHeader(
        'Password updated',
        'Your password has been reset successfully. Use your new credentials to sign in.',
      )}
      {renderPrimaryCTA('Back to Login', () =>
        push({ pathname: '/(auths)/login', params: resolvedEmail ? { email: resolvedEmail } : undefined }),
      )}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'verification':   return renderVerificationStep();
      case 'enter_password': return renderResetStep();
      case 'done':           return renderDoneStep();
      default:               return renderStartStep();
    }
  };

  // ─── Footer — split layout (copyright left, links right) — for start/verify steps
  const renderFooter = () => {
    // Reset step renders its own inline footer
    if (currentStep === 'enter_password') return null;
    return (
      <View
        className="flex-row items-center justify-between pt-12"
        style={{ opacity: 0.5 }}
      >
        <Typography variant="regular" size="labelSm" className="text-onSurfaceVariant dark:text-dark-textWeak">
          © 2024 Cortts Realty Group.
        </Typography>
        <View className="flex-row" style={{ columnGap: scale(16) }}>
          {['Privacy Policy', 'Terms of Service'].map(item => (
            <Typography key={item} variant="regular" size="labelSm" className="text-onSurfaceVariant dark:text-dark-textWeak">
              {item}
            </Typography>
          ))}
        </View>
      </View>
    );
  };

  // ─── Editorial left panel (always dark, theme-independent) ────────────────
  const renderEditorialPanel = () => {
    const isResetStep = currentStep === 'enter_password';
    return (
    <View
      className="flex-1 overflow-hidden p-16"
      style={{ backgroundColor: '#0f1d2d', justifyContent: isResetStep ? 'space-between' : 'flex-end' }}
    >
      {/* Estate photo */}
      <View style={[StyleSheet.absoluteFillObject, { opacity: isResetStep ? 1 : 0.6 }]}>
        <Image
          source={require('../../assets/images/login_web.png')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      </View>

      {/* Gradient — reset step uses full top-to-bottom dark overlay */}
      <LinearGradient
        colors={
          isResetStep
            ? ['rgba(15,29,45,0.4)', 'rgba(15,29,45,0.6)']
            : ['rgba(15,29,45,0)', colors.detail.overlay, '#0f1d2d']
        }
        locations={isResetStep ? [0, 1] : [0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { opacity: isResetStep ? 1 : 0.8 }]}
      />
      {/* Extra bottom overlay for reset step legibility */}
      {isResetStep && (
        <LinearGradient
          colors={['rgba(0,1,4,0)', 'rgba(0,1,4,0)', 'rgba(0,1,4,0.8)']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Brand row — top of panel for reset step */}
      {isResetStep && (
        <View className="flex-row items-center" style={{ columnGap: scale(8) }}>
          <Ionicons name="grid-outline" size={fontPixel(22)} color="#fbf9f6" />
          <Typography
            variant="serifBold"
            size="headlineSm"
            style={{ color: '#fbf9f6', letterSpacing: -0.6 }}
          >
            Cortts Real Estate
          </Typography>
        </View>
      )}

      {/* Bottom editorial content */}
      <View style={{ maxWidth: widthPixel(512), rowGap: verticalScale(16), paddingBottom: isResetStep ? verticalScale(48) : 0 }}>
        {/* Brand name — non-reset steps */}
        {!isResetStep && (
          <Typography
            variant="serifBold"
            size="headlineSm"
            style={{ color: '#f5f5f4', letterSpacing: -0.6 }}
          >
            Cortts
          </Typography>
        )}

        {/* Headline — step-specific */}
        <Typography variant="serifBold" size="h1" className="text-dark-text">
          {isResetStep
            ? 'Securing your\ngateway to the\nworld\'s most\nprestigious\narchitectural\nmasterpieces.'
            : 'Securing your legacy\nwith timeless\nelegance.'}
        </Typography>

        {/* Gold accent bar */}
        <View
          style={{
            width: widthPixel(isResetStep ? 80 : 64),
            height: verticalScale(4),
            backgroundColor: colors.secondary,
          }}
        />

        {/* Body — only for non-reset steps */}
        {!isResetStep && (
          <Typography
            variant="regular"
            size="bodyLg"
            style={{ color: '#d6d3d1', paddingTop: verticalScale(4) }}
          >
            Access our exclusive portfolio of global properties and personalized concierge services.
          </Typography>
        )}
      </View>
    </View>
    );
  };

  // ─── Done step — full screen centered ─────────────────────────────────────
  if (currentStep === 'done') {
    return (
      <View className="flex-1 bg-surfaceContainerLow dark:bg-dark-background items-center justify-center px-6">
        <View style={{ width: '100%', maxWidth: 480 }}>
          {renderDoneStep()}
        </View>
      </View>
    );
  }

  // ─── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <View className="flex-1 bg-surfaceContainerLow dark:bg-dark-background" style={{ paddingTop: top }}>
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
              {renderStepContent()}
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
      {renderEditorialPanel()}

      <ScrollView
        className="flex-1 bg-surfaceContainerLow dark:bg-dark-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="pt-8 pb-12"
          style={{
            width: '100%',
            maxWidth: 448,
            paddingHorizontal: scale(24),
            rowGap: verticalScale(32),
          }}
        >
          {renderStepContent()}
          {renderFooter()}
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;
