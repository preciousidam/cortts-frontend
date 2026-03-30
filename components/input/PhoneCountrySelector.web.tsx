import React from 'react';
import { FlatList, Pressable, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Typography } from '@/components/typography';
import type { PhoneCountry } from './PhoneCountrySelector';

type PhoneCountrySelectorProps = {
  countries: PhoneCountry[];
  selectedCountry: PhoneCountry;
  onSelect: (country: PhoneCountry) => void;
};

export default function PhoneCountrySelector({
  countries,
  selectedCountry,
  onSelect,
}: PhoneCountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [anchorWidth, setAnchorWidth] = React.useState(0);
  const { colors } = useTheme();
  const { scale, heightPixel, widthPixel, fontPixel } = useResponsive();

  const filteredCountries = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countries;
    return countries.filter((country) =>
      `${country.name} ${country.dialCode} ${country.code}`.toLowerCase().includes(normalized),
    );
  }, [countries, query]);

  const { refs, floatingStyles, context } = useFloating({
    strategy: 'absolute',
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(heightPixel(8)), flip()],
    open,
    onOpenChange: setOpen,
  });

  const dismiss = useDismiss(context, {
    enabled: true,
    escapeKey: true,
    referencePress: true,
    referencePressEvent: 'mousedown',
    outsidePress: true,
  });
  const { getFloatingProps } = useInteractions([dismiss]);

  React.useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <View>
      <Pressable
        ref={(node) => refs.setReference(node as any)}
        collapsable={false}
        onLayout={({ nativeEvent }) => setAnchorWidth(nativeEvent.layout.width)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(4),
          height: heightPixel(44),
        }}
        onPress={() => setOpen((prev) => !prev)}
      >
        <CountryFlag isoCode={selectedCountry.code} size={fontPixel(18)} />
        <Ionicons name="chevron-down" size={fontPixel(14)} color={colors.text.weaker} />
      </Pressable>

      <FloatingPortal id="modal-root">
        {open && (
          <View
            ref={(node) => refs.setFloating(node as any)}
            style={[
              {
                backgroundColor: colors.card,
                borderRadius: scale(12),
                borderWidth: scale(1),
                borderColor: colors.border,
                width: Math.max(anchorWidth + widthPixel(160), widthPixel(280)),
                maxHeight: heightPixel(320),
                zIndex: 2147483647,
                boxShadow: '0px 8px 24px rgba(0, 1, 4, 0.12)',
                marginLeft: -scale(16),
              } as ViewStyle,
              floatingStyles as ViewStyle,
            ]}
            {...getFloatingProps()}
          >
            <View style={{ padding: scale(12), borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search country"
                placeholderTextColor={colors.text.weaker}
                style={{
                  minHeight: heightPixel(40),
                  borderWidth: scale(1),
                  borderColor: colors.border,
                  borderRadius: scale(8),
                  paddingHorizontal: scale(12),
                  color: colors.text.default,
                  fontSize: fontPixel(14),
                }}
              />
            </View>

            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const active = item.code === selectedCountry.code;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: scale(12),
                      paddingVertical: scale(10),
                      backgroundColor: active ? `${colors.secondary}12` : 'transparent',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: scale(10), flex: 1 }}>
                      <CountryFlag isoCode={item.code} size={fontPixel(18)} />
                      <View style={{ flex: 1 }}>
                        <Typography variant="medium" size="body" className="text-onSurface dark:text-dark-text">
                          {item.name}
                        </Typography>
                        <Typography variant="regular" size="bodySm" className="text-onSurfaceVariant dark:text-dark-textWeak">
                          {item.dialCode}
                        </Typography>
                      </View>
                    </View>
                    {active && <Ionicons name="checkmark" size={fontPixel(16)} color={colors.secondary} />}
                  </Pressable>
                );
              }}
            />
          </View>
        )}
      </FloatingPortal>
    </View>
  );
}
