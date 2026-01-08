import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useStyles = () => {
  const { widthPixel, fontPixel, heightPixel } = useResponsive();
  const { colors, fonts, shadow } = useTheme();
  const roundness = useRoundness();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 'auto',
          zIndex: 10000,
          rowGap: heightPixel(8)
        },
        button: {
          width: widthPixel(32),
          height: widthPixel(32),
        },
        modalContent: {
          ...roundness.m,
          borderColor: colors.text.weaker,
          paddingHorizontal: widthPixel(1),
          paddingVertical: heightPixel(1),
          ...shadow(heightPixel(2), widthPixel(8)),
          maxHeight: heightPixel(400),
        },
        option: {
          paddingVertical: heightPixel(16),
          paddingHorizontal: widthPixel(24),
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: widthPixel(16),
          width: '100%'
        },
        destroy: {
          backgroundColor: colors.error.lightHover+'12',
        },
        hover: {
          backgroundColor: '#F5FBFF',
        },
        optionText: {
          fontSize: fontPixel(14),
          color: colors.text.weak,
          flex: 1
        },
        hoveredText: {
          color: colors.brand.blue,
        },
        destroyText: {
          color: colors.error.normal,
        }
      }),
    [colors, widthPixel, fontPixel]
  );
};
