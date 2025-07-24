import React from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Fonts } from '@/styleguide/theme/Fonts';

type FloatingPickerProps<T> = {
  visible: boolean;
  items: T[];
  keyExtractor: (item: T) => string;
  labelExtractor: (item: T) => string;
  onSelect: (item: T) => void;
  onClose: () => void;
  title?: string;
  searchable?: boolean;
};

export function FloatingPicker<T>({
  visible,
  items,
  keyExtractor,
  labelExtractor,
  onSelect,
  onClose,
  title = 'Select an option',
  searchable = true,
}: FloatingPickerProps<T>) {
  const { scale, fontPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const [search, setSearch] = React.useState('');
  const styles = useStyles();

  const filteredItems = items.filter(item =>
    labelExtractor(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {searchable && (
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search..."
              placeholderTextColor={colors.textWeaker}
              style={[
                styles.searchInput,
                {
                  borderColor: colors.border,
                  color: colors.text,
                  fontSize: fontPixel(14),
                },
              ]}
            />
          )}
          <FlatList
            data={filteredItems}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, { borderBottomColor: colors.border }]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[styles.itemText, { color: colors.text }]}>
                  {labelExtractor(item)}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </Modal>
  );
}

const useStyles = () => {
  const { scale, heightPixel, fontPixel } = useResponsive();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
      maxHeight: heightPixel(500), // Adjusted for responsive height
      padding: scale(16),
      borderTopLeftRadius: scale(12),
      borderTopRightRadius: scale(12),
    },
    title: {
      ...Fonts.semiBold,
      fontSize: fontPixel(16),
      marginBottom: scale(12),
    },
    searchInput: {
      borderWidth: scale(1),
      borderRadius: scale(8),
      paddingHorizontal: scale(12),
      paddingVertical: Platform.OS === 'ios' ? scale(12) : scale(8),
      marginBottom: scale(12),
      ...Fonts.regular,
    },
    item: {
      paddingVertical: scale(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    itemText: {
      ...Fonts.regular,
      fontSize: fontPixel(14),
    },
  });
};
