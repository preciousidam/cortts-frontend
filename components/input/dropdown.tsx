

import React, { useState } from 'react';
import { Modal, Pressable, View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { useRoundness } from '@/styleguide/theme/Border';
import { Typography } from '../typography';

export type DropdownOption = {
  label: string;
  value: string;
};

type BaseDropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedValues: string[];
  onSelect: (selected: string[]) => void;
  multiSelect?: boolean;
};

export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  label,
  placeholder = 'Select...',
  options,
  selectedValues,
  onSelect,
  multiSelect = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const { scale, fontPixel, heightPixel } = useResponsive();
  const styles = useStyles();

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleValue = (value: string) => {
    if (multiSelect) {
      const exists = selectedValues.includes(value);
      const updated = exists
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onSelect(updated);
    } else {
      onSelect([value]);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: DropdownOption }) => {
    const isSelected = selectedValues.includes(item.value);
    return (
      <Pressable
        style={[styles.option, isSelected && styles.selected]}
        onPress={() => toggleValue(item.value)}
      >
        <Typography style={[styles.optionText, { color: !isSelected ? colors.text : colors.textWeak }]}>{item.label}</Typography>
        {isSelected && <Ionicons name="checkmark" size={scale(18)} color={colors.primary} />}
      </Pressable>
    );
  };

  return (
    <View>
      {label && <Typography variant='medium' size='body' style={[styles.label, { color: colors.text }]}>{label}</Typography>}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.selector, { borderColor: colors.border }]}
      >
        <Typography style={{ color: colors.text }}>
          {selectedValues.length
            ? options
                .filter((opt) => selectedValues.includes(opt.value))
                .map((o) => o.label)
                .join(', ')
            : placeholder}
        </Typography>
        <Ionicons name="chevron-down" size={scale(18)} color={colors.text} />
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
                placeholderTextColor={colors.textWeaker}
              />
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={scale(20)} color={colors.text} />
              </Pressable>
            </View>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
              style={{ maxHeight: heightPixel(400) }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const useStyles = () => {
  const { scale, verticalScale } = useResponsive();
  const roundness = useRoundness();
  const { colors } = useTheme();

  return StyleSheet.create({
    label: {
      marginBottom: verticalScale(4),
    },
    selector: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...roundness.m
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000070',
      justifyContent: 'flex-end',
    },
    modalContent: {
      padding: 16,
      borderTopLeftRadius: scale(12),
      borderTopRightRadius: scale(12),
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: scale(8),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(6),
    },
    option: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selected: {
      backgroundColor: '#F5FBFF',
      borderLeftWidth: scale(4),
      borderLeftColor: colors.primary
    },
    optionText: {
    },
  });
}