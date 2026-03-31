import React from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { flip, offset, useFloating } from '@floating-ui/react-native';
import CountryFlag from 'react-native-country-flag';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Typography } from '@/components/typography';

export type PhoneCountry = {
  code: string;
  dialCode: string;
  name: string;
};

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
  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(heightPixel(8)), flip()],
  });

  React.useEffect(() => {
    if (open) {
      update();
    } else {
      setQuery('');
    }
  }, [open, update]);

  const filteredCountries = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countries;
    return countries.filter((country) =>
      `${country.name} ${country.dialCode} ${country.code}`.toLowerCase().includes(normalized),
    );
  }, [countries, query]);

  return (
    <View>
      <Pressable
        ref={(node) => refs.setReference(node as any)}
        collapsable={false}
        onLayout={({ nativeEvent }) => setAnchorWidth(nativeEvent.layout.width)}
        onPress={() => setOpen((prev) => !prev)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: scale(4),
          height: heightPixel(44),
        }}
      >
        <CountryFlag isoCode={selectedCountry.code} size={fontPixel(18)} />
        <Ionicons name="chevron-down" size={fontPixel(14)} color={colors.text.weaker} />
      </Pressable>

      {open && (
        <View
          ref={(node) => refs.setFloating(node as any)}
          collapsable={false}
          style={[
            {
              backgroundColor: colors.card,
              borderRadius: scale(12),
              borderWidth: scale(1),
              borderColor: colors.border,
              width: Math.max(anchorWidth + widthPixel(160), widthPixel(260)),
              maxHeight: heightPixel(320),
              zIndex: 100000,
              shadowColor: '#000104',
              shadowOpacity: 0.12,
              shadowRadius: widthPixel(16),
              shadowOffset: { width: 0, height: heightPixel(8) },
              elevation: 8,
            },
            floatingStyles,
          ]}
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
    </View>
  );
}
