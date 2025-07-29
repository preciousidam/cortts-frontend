

import React, { useEffect, useState } from 'react';
import { Pressable, View, FlatList, TextInput } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../typography';
import { useFloating, flip, offset } from '@floating-ui/react-native';
import { BaseDropdownProps, DropdownOption, useDropdownStyles } from './dropdownStyles';



export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  label,
  placeholder = 'Select...',
  options = [],
  selectedValues = [],
  onSelect,
  multiSelect = false,
  style,
  icon_position = 'left',
  isSearchable = true,
  required = false,
  anchor,
  error,
  info,
  labelStyle = {}
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const { scale, fontPixel, heightPixel } = useResponsive();
  const styles = useDropdownStyles();
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);
  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom',
    middleware: [offset(heightPixel(8)), flip()],
  });

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

  const showModal = () => {
    setModalVisible(true);
  }

  useEffect(() => {
    if (modalVisible){
      update();
    }
  }, [modalVisible, dropdownWidth]);

  const renderIcon = () => {
    return <Ionicons name="chevron-down" size={scale(18)} color={'#808080'} />;
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

  const renderValue = selectedValues.length
    ? options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((o) => o.label)
        .join(', ')
    : placeholder

  return (
    <View style={[{ width: 'auto', alignSelf: 'flex-start', zIndex: 10000, rowGap: heightPixel(8) }, style]} onLayout={({nativeEvent: {layout}}) => setDropdownWidth(layout.width)}>
      {label && <View style={[styles.sb ]}>
        {Boolean(required) && <Typography variant='medium' size='body' style={styles.required}>*</Typography>}
        <Typography variant='medium' size='body' style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Typography>
      </View>}
      {!anchor ? (
          <Pressable
            onPress={showModal}
            style={[styles.selector, icon_position === 'left' ? styles.paddingRight : styles.paddingLeft, { borderColor: colors.neutral }]}
            ref={(node) => refs.setReference(node as any)}
            collapsable={false}
          >
          {icon_position == 'left' && <View style={styles.leftIconView}>{renderIcon()}</View>}
          <Typography style={{ color: colors.text, flex: 1 }}>
            {renderValue}
          </Typography>
          {icon_position == 'right' && <View style={styles.rightIconView}>{renderIcon()}</View>}
        </Pressable>
      ) : anchor({ ref: refs.setReference, value: renderValue, onPress: showModal })}

      {modalVisible && <View  ref={refs.setFloating} collapsable={false} style={[styles.modalContent, { backgroundColor: colors.card, width: dropdownWidth }, floatingStyles]}>
        {isSearchable && <View style={styles.modalHeader}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text, borderColor: colors.border }]}
            placeholderTextColor={colors.textWeaker}
          />
        </View>}
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          renderItem={renderItem}
          style={{ maxHeight: heightPixel(400) }}
        />
      </View>}
      {error && <Typography style={styles.errorText}>{error}</Typography>}
      {info && <Typography style={styles.infoText}>{info}</Typography>}
    </View>
  );
};
