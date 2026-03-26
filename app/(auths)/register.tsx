import React from 'react';
import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { isLt } from '@/styleguide/breakpoints';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { LinkTypography, Typography } from '@/components/typography';
import { FormTextInput, PasswordFormInput, PhoneFormInput } from '@/components/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

// Native uses expo-linear-gradient; web uses a CSS background gradient via View.
let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
  LinearGradient = ({ colors, start, end, style, children }: any) => (
    <View
      style={[
        style,
        {
          // @ts-ignore — web-only CSS property
          background: `linear-gradient(${gradientAngle(start, end)}, ${colors.join(', ')})`,
        },
      ]}
    >
      {children}
    </View>
  );
}

function gradientAngle(
  start: { x: number; y: number } = { x: 0, y: 0 },
  end: { x: number; y: number } = { x: 1, y: 1 },
): string {
  const angle = Math.round(Math.atan2(end.x - start.x, end.y - start.y) * (180 / Math.PI));
  return `${angle}deg`;
}

type IForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const { breakpoint, widthPixel, heightPixel, fontPixel, scale, verticalScale } = useResponsive();
  const styles = useStyles();
  const { register, isLoading } = useAuth();
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '', phone: '', confirmPassword: '' },
  });

  const isMobile = isLt(breakpoint, 'md');

  const onSubmit = (data: IForm) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (data.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    register({
      fullname: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  };

  const renderForm = () => (
    <View style={styles.formCard}>
      {/* Header */}
      <View className="items-center">
        <Typography size="headlineSm" variant="serifBold" style={{ fontSize: fontPixel(24) }}>
          Create Account
        </Typography>
        <Typography size="bodyMd" className="text-text-weak dark:text-dark-textWeak text-center mt-1">
          Get started with your free account
        </Typography>
      </View>

      {/* Inputs */}
      <View style={{ rowGap: verticalScale(16) }}>
        {/* First + Last name row */}
        <View style={{ flexDirection: 'row', columnGap: scale(12) }}>
          <View style={{ flex: 1 }}>
            <FormTextInput
              name="firstName"
              control={control}
              label="First Name"
              inputProps={{ placeholder: 'John' }}
              rules={{ required: 'First name is required' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormTextInput
              name="lastName"
              control={control}
              label="Last Name"
              inputProps={{ placeholder: 'Doe' }}
              rules={{ required: 'Last name is required' }}
            />
          </View>
        </View>
        <FormTextInput
          name="email"
          control={control}
          label="Email"
          inputProps={{ keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'john.doe@example.com' }}
          rules={{ required: 'Email is required' }}
        />
        <PhoneFormInput
          name="phone"
          control={control}
          label="Phone Number"
          rules={{ required: 'Phone number is required' }}
          inputProps={{ placeholder: '+1 (555) 000-0000', keyboardType: 'phone-pad' }}
        />
        <PasswordFormInput
          name="password"
          control={control}
          label="Password"
          inputProps={{ placeholder: 'Minimum 8 characters' }}
          rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
        />
        <PasswordFormInput
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          inputProps={{ placeholder: 'Re-enter your password' }}
          rules={{ required: 'Please confirm your password' }}
        />
        <Typography size="caption" className="text-text-weak dark:text-dark-textWeak">
          By creating an account, you agree to our{' '}
          <LinkTypography style={{ textDecorationLine: 'underline' }} href="https://cortts.com/terms" variant="regular" size="caption">
            Terms of Service
          </LinkTypography>{' '}
          and{' '}
          <LinkTypography style={{ textDecorationLine: 'underline' }} href="https://cortts.com/privacy" variant="regular" size="caption">
            Privacy Policy
          </LinkTypography>.
        </Typography>
      </View>

      {/* Submit */}
      <Button
        gradient
        size="large"
        title={isLoading ? 'Creating Account...' : 'Create Account'}
        className="w-full"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isLoading}
      />

      {/* Sign in */}
      <View
        className="items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: 'rgba(196,198,205,0.3)' }}
      >
        <Typography size="bodyMd" className="text-text-weak dark:text-dark-textWeak">
          Already have an account?{' '}
          <LinkTypography href="./login" variant="bold">Log in</LinkTypography>
        </Typography>
      </View>
    </View>
  );

  /* ── Mobile: full-screen gradient with form card inside ── */
  if (isMobile) {
    return (
      <View className="flex-1 h-full">
        <LinearGradient
          colors={['#0f1d2d', '#8b7355']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ paddingTop: top + heightPixel(16), flex: 1 }]}
        >
          {/* Logo */}
          <View className="flex-row items-center px-6" style={{ columnGap: scale(8) }}>
            <View className="w-10 h-10 rounded-xl bg-white items-center justify-center">
              <Typography className="text-primary font-bold text-xl">C</Typography>
            </View>
            <Typography variant="bold" style={{ color: '#fff', fontSize: fontPixel(20) }}>
              cortts.
            </Typography>
          </View>
          {/* Form inside gradient */}
          <KeyboardAwareScrollView>
            <View className="items-center justify-center px-6 my-10">
              {renderForm()}
            </View>
          </KeyboardAwareScrollView>
          <KeyboardToolbar />
        </LinearGradient>
      </View>
    );
  }

  /* ── Desktop/Tablet: left gradient panel + right scrollable form ── */
  return (
    <View className="flex-1 flex-row bg-background dark:bg-dark-background">

      {/* Left — gradient panel */}
      <LinearGradient
        colors={['#0f1d2d', '#1a3050', '#8b7355']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.leftPanel}
      >
        {/* Decorative blobs */}
        <View style={[styles.blob, { top: heightPixel(80), left: widthPixel(80), width: widthPixel(200), height: widthPixel(200) }]} />
        <View style={[styles.blob, { bottom: heightPixel(80), right: widthPixel(80), width: widthPixel(300), height: widthPixel(300) }]} />
        <View style={[styles.rotatedSquare, { top: heightPixel(160), right: widthPixel(120), width: widthPixel(100), height: widthPixel(100) }]} />

        {/* Logo */}
        <View className="absolute flex-row items-center" style={{ top: heightPixel(32), left: widthPixel(32), columnGap: scale(8) }}>
          <View className="rounded-xl bg-white items-center justify-center" style={{ width: widthPixel(40), height: widthPixel(40) }}>
            <Typography className="text-primary font-bold" style={{ fontSize: fontPixel(20) }}>C</Typography>
          </View>
          <Typography variant="bold" style={{ color: '#fff', fontSize: fontPixel(20) }}>cortts.</Typography>
        </View>

        {/* Illustration — UserPlus central circle + floating icon cards */}
        <View className="absolute inset-0 items-center justify-center" style={{ paddingBottom: heightPixel(200) }}>
          {/* Connecting rings */}
          <View style={[styles.ring, { width: widthPixel(220), height: widthPixel(220) }]} />
          <View style={[styles.ring, { width: widthPixel(280), height: widthPixel(280), position: 'absolute' }]} />

          {/* Central icon */}
          <View style={styles.centralIcon}>
            <Ionicons name="person-add" size={fontPixel(56)} color={colors.primary} />
          </View>

          {/* Floating card — top-left */}
          <View style={[styles.floatingCard, { top: heightPixel(-20), left: widthPixel(20) }]}>
            <Ionicons name="business" size={fontPixel(28)} color="#fff" />
          </View>
          {/* Floating card — top-right */}
          <View style={[styles.floatingCard, { top: heightPixel(10), right: widthPixel(20) }]}>
            <Ionicons name="people" size={fontPixel(28)} color="#fff" />
          </View>
          {/* Floating card — bottom */}
          <View style={[styles.floatingCard, { bottom: heightPixel(-30) }]}>
            <Ionicons name="checkmark-circle" size={fontPixel(28)} color="#fff" />
          </View>
        </View>

        {/* Marketing copy + feature pills */}
        <View className="absolute bottom-0 left-0 right-0 items-center" style={{ paddingBottom: heightPixel(60), paddingHorizontal: widthPixel(40) }}>
          <Typography
            variant="serifBold"
            className="text-center"
            style={{ color: '#fff', fontSize: fontPixel(36), lineHeight: fontPixel(44), marginBottom: verticalScale(12) }}
          >
            Join the future of real estate management
          </Typography>
          <Typography className="text-center" style={{ color: 'rgba(255,255,255,0.9)', fontSize: fontPixel(16), marginBottom: verticalScale(20) }}>
            Create your account and start managing properties like a pro.
          </Typography>
          {/* Feature pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(8), justifyContent: 'center' }}>
            {['✓ Free 30-day trial', '✓ No credit card needed', '✓ Cancel anytime'].map((pill) => (
              <View key={pill} style={styles.pill}>
                <Typography variant="semiBold" style={{ color: '#fff', fontSize: fontPixel(12) }}>{pill}</Typography>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Right — scrollable form */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: scale(32) }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderForm()}
      </ScrollView>
    </View>
  );
};

const useStyles = () => {
  const { scale, verticalScale, widthPixel } = useResponsive();

  return StyleSheet.create({
    formCard: {
      width: '100%',
      maxWidth: widthPixel(440),
      backgroundColor: '#ffffff',
      borderRadius: widthPixel(16),
      padding: scale(24),
      rowGap: verticalScale(20),
      shadowColor: '#1b1c1a',
      shadowOffset: { width: 0, height: widthPixel(4) },
      shadowOpacity: 0.05,
      shadowRadius: widthPixel(32),
      elevation: 4,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(24),
    },
    leftPanel: {
      flex: 1,
      overflow: 'hidden',
    },
    blob: {
      position: 'absolute',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 9999,
    },
    rotatedSquare: {
      position: 'absolute',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: widthPixel(16),
      transform: [{ rotate: '45deg' }],
    },
    centralIcon: {
      width: widthPixel(140),
      height: widthPixel(140),
      borderRadius: widthPixel(70),
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#1b1c1a',
      shadowOffset: { width: 0, height: widthPixel(8) },
      shadowOpacity: 0.08,
      shadowRadius: widthPixel(24),
      elevation: 6,
    },
    ring: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
      borderRadius: 9999,
    },
    floatingCard: {
      position: 'absolute',
      padding: scale(14),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: widthPixel(16),
      shadowColor: '#1b1c1a',
      shadowOffset: { width: 0, height: widthPixel(4) },
      shadowOpacity: 0.08,
      shadowRadius: widthPixel(16),
      elevation: 3,
    },
    pill: {
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(8),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 9999,
    },
  });
};

export default Register;
