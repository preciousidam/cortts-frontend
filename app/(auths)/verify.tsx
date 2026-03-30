import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isLt } from '@/styleguide/breakpoints';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Button } from '@/components/button';
import { Typography } from '@/components/typography';
import Toast from 'react-native-toast-message';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

let LinearGradient: React.ComponentType<any>;
if (Platform.OS !== 'web') {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} else {
  LinearGradient = ({ colors, locations, start, end, style, children }: any) => {
    const dx = (end?.x ?? 1) - (start?.x ?? 0);
    const dy = (end?.y ?? 1) - (start?.y ?? 0);
    const angle = Math.round(Math.atan2(dx, -dy) * (180 / Math.PI));
    const stops = (colors as string[])
      .map((color, index) =>
        locations?.[index] !== undefined ? `${color} ${Math.round(locations[index] * 100)}%` : color,
      )
      .join(', ');

    return (
      <View
        style={[
          style,
          // @ts-ignore web-only CSS property
          { background: `linear-gradient(${angle}deg, ${stops})` },
        ]}
      >
        {children}
      </View>
    );
  };
}

const Verify: React.FC = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const { breakpoint, scale, verticalScale, widthPixel, fontPixel } = useResponsive();
  const { back } = useRouter();
  const isMobile = isLt(breakpoint, 'md');

  const onResendEmail = () => {
    Toast.show({
      type: 'info',
      text1: 'Verification email',
      text2: email
        ? `A resend action is not connected yet for ${email}.`
        : 'A resend action is not connected yet.',
    });
  };

  const renderEnvelope = (iconSize: number, boxSize: number) => (
    <View
      style={{
        width: widthPixel(boxSize),
        height: widthPixel(boxSize),
        borderRadius: widthPixel(12),
        backgroundColor: '#efeeeb',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="mail-outline" size={fontPixel(iconSize)} color={colors.secondary} />
    </View>
  );

  const renderPrimaryAction = () => (
    <Button
      title="RESEND EMAIL"
      variant="primary"
      size="large"
      onPress={onResendEmail}
      style={[
        {
          width: '100%',
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          borderRadius: widthPixel(0),
          shadowColor: '#000104',
          shadowOpacity: 0.12,
          shadowRadius: widthPixel(16),
          shadowOffset: { width: 0, height: verticalScale(8) },
          elevation: 3,
        },
      ]}
      titleStyle={{
        fontSize: fontPixel(14),
        lineHeight: fontPixel(20),
        letterSpacing: 1.4,
        fontWeight: '700',
      }}
    />
  );

  const renderBackLink = () => (
    <Pressable
      onPress={back}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(8),
      }}
    >
      <Ionicons name="arrow-back" size={fontPixel(14)} color={colors.secondary} />
      <Typography
        variant="regular"
        size="body"
        style={{ color: colors.secondary }}
      >
        Back to Sign In
      </Typography>
    </Pressable>
  );

  const renderFooter = (align: 'center' | 'left') => (
    <View
      style={{
        width: '100%',
        paddingTop: verticalScale(isMobile ? 56 : 96),
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <View
        style={{
          width: '100%',
          borderTopWidth: 1,
          borderTopColor: '#e4e2df',
          paddingTop: verticalScale(33),
          alignItems: align === 'center' ? 'center' : 'flex-start',
        }}
      >
        <Typography
          variant="regular"
          size="labelSm"
          style={{
            color: 'rgba(68, 71, 76, 0.6)',
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            textAlign: align,
          }}
        >
          © 2024 EstatePremium Realty Group
        </Typography>
      </View>
    </View>
  );

  if (isMobile) {
    return (
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            minHeight: '100%',
            paddingTop: top,
            backgroundColor: colors.primaryBlue.normal,
          }}
        >
          <View style={{ height: verticalScale(280), overflow: 'hidden' }}>
            <Image
              source={require('../../assets/images/login_web.png')}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: '#0f1d2d',
                  opacity: 0.45,
                },
              ]}
            />
            <LinearGradient
              colors={['rgba(15,29,45,0.15)', 'rgba(15,29,45,0.35)', 'rgba(15,29,45,0.92)']}
              locations={[0, 0.45, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: scale(24),
                paddingBottom: verticalScale(28),
                rowGap: verticalScale(12),
              }}
            >
              <Typography
                variant="semiBold"
                size="labelLg"
                style={{
                  color: colors.secondary,
                  letterSpacing: 2.8,
                  textTransform: 'uppercase',
                }}
              >
                Cortts Real Estate
              </Typography>
              <Typography
                variant="serifRegular"
                size="headlineLg"
                style={{ color: '#ffffff', maxWidth: widthPixel(280) }}
              >
                A more secure estate
              </Typography>
              <Typography
                variant="regular"
                size="bodyLg"
                style={{ color: '#788599', maxWidth: widthPixel(320) }}
              >
                Exclusivity starts with security. We ensure your data remains as private as your future residence.
              </Typography>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.background,
              borderTopLeftRadius: widthPixel(28),
              borderTopRightRadius: widthPixel(28),
              marginTop: -widthPixel(18),
              paddingHorizontal: scale(24),
              paddingTop: verticalScale(32),
              paddingBottom: bottom + verticalScale(32),
            }}
          >
            <View style={{ width: '100%', rowGap: verticalScale(24), alignItems: 'center' }}>
              <Typography
                variant="serifBold"
                size="headlineSm"
                className="text-onSurface"
                style={{ letterSpacing: -0.6 }}
              >
                EstatePremium
              </Typography>

              {renderEnvelope(26, 78)}

              <View style={{ rowGap: verticalScale(12), alignItems: 'center' }}>
                <Typography
                  variant="serifRegular"
                  size="headlineLg"
                  className="text-onSurface text-center"
                >
                  Verify your email
                </Typography>
                <Typography
                  variant="regular"
                  size="bodyLg"
                  className="text-onSurfaceVariant text-center"
                  style={{ maxWidth: widthPixel(320), lineHeight: fontPixel(26) }}
                >
                  {`We've sent a verification link to your inbox. Please check your email and click the link to confirm your account and access your curated portfolio.`}
                </Typography>
              </View>

              <View style={{ width: '100%', rowGap: verticalScale(24) }}>
                {renderPrimaryAction()}
                <View style={{ alignItems: 'center' }}>{renderBackLink()}</View>
              </View>

              {renderFooter('center')}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 flex-row">
      <View
        style={{
          flex: 1,
          minHeight: '100%',
          backgroundColor: colors.primaryBlue.normal,
          overflow: 'hidden',
        }}
      >
        <Image
          source={require('../../assets/images/login_web.png')}
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [{ scale: 1.06 }],
            },
          ]}
          contentFit="cover"
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#07121f',
              opacity: 0.6,
            },
          ]}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: '#0f1d2d',
              opacity: 0.22,
            },
          ]}
        />
        <LinearGradient
          colors={['rgba(15,29,45,0)', 'rgba(15,29,45,0)', 'rgba(15,29,45,0.82)']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          style={{
            position: 'absolute',
            left: scale(48),
            right: scale(48),
            bottom: verticalScale(48),
            rowGap: verticalScale(20),
            maxWidth: widthPixel(448),
          }}
        >
          <Typography
            variant="semiBold"
            size="labelLg"
            style={{
              color: colors.secondary,
              textTransform: 'uppercase',
              letterSpacing: 2.8,
            }}
          >
            Cortts Real Estate
          </Typography>
          <Typography
            variant="serifRegular"
            size="h1"
            style={{
              color: '#ffffff',
              fontSize: fontPixel(60),
              lineHeight: fontPixel(60),
              maxWidth: widthPixel(412),
            }}
          >
            {'A more secure\nestate'}
          </Typography>
          <Typography
            variant="regular"
            size="bodyLg"
            style={{
              color: '#788599',
              maxWidth: widthPixel(384),
            }}
          >
            Exclusivity starts with security. We ensure your data remains as private as your future residence.
          </Typography>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: scale(64),
          paddingVertical: verticalScale(64),
        }}
      >
        <View style={{ width: '100%', maxWidth: widthPixel(448), alignItems: 'center' }}>
          <View style={{ paddingBottom: verticalScale(48) }}>
            <Typography
              variant="serifBold"
              size="headlineSm"
              className="text-onSurface"
              style={{ letterSpacing: -0.6 }}
            >
              EstatePremium
            </Typography>
          </View>

          <View style={{ paddingBottom: verticalScale(32) }}>
            {renderEnvelope(30, 78)}
          </View>

          <View style={{ paddingBottom: verticalScale(16) }}>
            <Typography
              variant="serifRegular"
              size="headlineLg"
              className="text-onSurface text-center"
              style={{ fontSize: fontPixel(36), lineHeight: fontPixel(40) }}
            >
              Verify your email
            </Typography>
          </View>

          <View style={{ paddingBottom: verticalScale(40) }}>
            <Typography
              variant="regular"
              size="bodyLg"
              className="text-onSurfaceVariant text-center"
              style={{
                maxWidth: widthPixel(446),
                lineHeight: fontPixel(26),
              }}
            >
              {`We've sent a verification link to your inbox. Please check your email and click the link to confirm your account and access your curated portfolio.`}
            </Typography>
          </View>

          <View style={{ width: '100%', paddingBottom: verticalScale(32) }}>
            {renderPrimaryAction()}
          </View>

          <View style={{ alignItems: 'center' }}>
            {renderBackLink()}
          </View>

          {renderFooter('center')}

          {!!email && (
            <View style={{ paddingTop: verticalScale(16) }}>
              <Typography
                variant="regular"
                size="bodySm"
                className="text-onSurfaceVariant text-center"
              >
                Sent to {email}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Verify;
