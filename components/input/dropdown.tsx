

import React, { useState } from 'react';
import { Modal, Pressable, View, FlatList, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { useRoundness } from '@/styleguide/theme/Border';
import { Typography } from '../typography';
import { generateColorScale } from '@/styleguide/theme/Colors';

export type DropdownOption = {
  label: string;
  value: string;
};

type BaseDropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedValues?: string[];
  onSelect?: (selected: string[]) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
  icon_position?: 'left' | 'right';
};

export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  label,
  placeholder = 'Select...',
  options,
  selectedValues = [],
  onSelect,
  multiSelect = true,
  style,
  icon_position = 'left',
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
      onSelect?.(updated);
    } else {
      onSelect?.([value]);
      setModalVisible(false);
    }
  };

  const renderLeftIcon = () => {
    return <Ionicons name="chevron-down" size={scale(18)} color={colors.text} />;
  }

  const renderRightIcon = () => {
    return <Ionicons name="chevron-down" size={scale(18)} color={colors.text} />;
  }

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
    <View style={style}>
      {label && <Typography variant='medium' size='body' style={[styles.label, { color: colors.text }]}>{label}</Typography>}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.selector, { borderColor: colors.neutral }]}
      >
        {icon_position == 'left' && <View style={styles.leftIconView}>{renderRightIcon()}</View>}
        <Typography style={{ color: colors.text }}>
          {selectedValues.length
            ? options
                .filter((opt) => selectedValues.includes(opt.value))
                .map((o) => o.label)
                .join(', ')
            : placeholder}
        </Typography>
        {icon_position == 'right' && <View style={styles.rightIconView}>{renderRightIcon()}</View>}
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
      // paddingVertical: verticalScale(10),
      flexDirection: 'row',
      columnGap: scale(12),
      alignItems: 'center',
      ...roundness.m,
      height: verticalScale(44)
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
    leftIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopLeftRadius: verticalScale(8),
      borderBottomLeftRadius: verticalScale(8),
      borderRightColor: generateColorScale(colors.neutral).normalBase,
      borderRightWidth: scale(.7),
      height: '100%',
      zIndex: -1
    },
    rightIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopRightRadius: verticalScale(8),
      borderBottomRightRadius: verticalScale(8),
      borderLeftColor: generateColorScale(colors.neutral).normalBase,
      borderLeftWidth: scale(.7),
      height: '100%',
      zIndex: -1
    },
  });
}