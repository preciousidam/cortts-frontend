import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive'; // if your project uses utilities/useResponsive, swap import
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { UnitStatus } from '@/types/models';
import { Image } from 'expo-image';


export type UnitPreviewItem = {
  id: string;
  name: string;
  projectName?: string;
  status: UnitStatus;
  priceLabel?: string;
  image?: string | null;
};

export const UnitsPreview: React.FC<{
  title?: string;
  units: UnitPreviewItem[];
  onViewAll?: () => void;
  onOpenUnit?: (unitId: string) => void;
}> = ({ title = 'Units', units, onViewAll, onOpenUnit }) => {
  const { colors, fonts } = useTheme();
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const ROUNDNESS = useRoundness();
  const placeHolder = "eUIW_,0gxURjobyGxBM|W.ae20$eNaWpn%WCX9xZf7oJOEoNt7s.ay"

  const styles = StyleSheet.create({
    section: { rowGap: heightPixel(12) },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: widthPixel(20),
    },
    title: {
      ...fonts?.bold,
      fontSize: fontPixel(16),
      color: colors.text.default,
    },
    viewAll: {
      ...fonts?.semiBold,
      fontSize: fontPixel(13),
      color: colors.primary,
    },
    card: {
      width: widthPixel(230),
      backgroundColor: colors.card,
      // padding: widthPixel(14),
      ...ROUNDNESS.m,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      rowGap: heightPixel(10),
      shadowColor: "#acacac",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    cardBody: {
      padding: widthPixel(16),
      rowGap: heightPixel(10),
    },
    image: {
      width: '100%',
      height: widthPixel(100),
      ...ROUNDNESS.m,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: colors.neutral.light,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      columnGap: widthPixel(10),
    },
    unitName: {
      flex: 1,
      ...fonts?.bold,
      fontSize: fontPixel(14),
      color: colors.text.default,
    },
    sub: {
      ...fonts?.medium,
      fontSize: fontPixel(12),
      color: colors.text.weak,
    },
    price: {
      ...fonts?.bold,
      fontSize: fontPixel(13),
      color: colors.text.default,
    },
    pill: {
      paddingHorizontal: widthPixel(10),
      paddingVertical: heightPixel(5),
      borderRadius: widthPixel(999),
      backgroundColor: colors.neutral.normal,
    },
    pillSold: {
      backgroundColor: colors.error.normal, // if you have theme danger tint, swap it in
    },
    pillAvail: {
      backgroundColor: colors.successful.normal, // if you have theme success tint, swap it in
    },
    pillText: {
      fontSize: fontPixel(11),
      ...fonts?.bold,
      color: '#FFFFFF',
    },
  });

  const statusLabel = (s: UnitPreviewItem['status']) =>
    s === 'sold' ? 'Sold' : 'Available';

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {!!onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: widthPixel(20),
          columnGap: widthPixel(12),
        }}
        data={units}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => onOpenUnit?.(item.id)}
          >
            <Image source={{ uri: item.image ?? undefined }} placeholder={{blurhash: placeHolder}} style={styles.image} />
            <View style={styles.cardBody}>
              <View style={styles.topRow}>
                <Text style={styles.unitName} numberOfLines={1}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.pill,
                    item.status === 'sold' ? styles.pillSold : styles.pillAvail,
                  ]}
                >
                  <Text style={styles.pillText}>{statusLabel(item.status)}</Text>
                </View>
              </View>

              {!!item.projectName && (
                <Text style={styles.sub} numberOfLines={1}>
                  {item.projectName}
                </Text>
              )}

              {!!item.priceLabel && (
                <Text style={styles.price} numberOfLines={1}>
                  {item.priceLabel}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};