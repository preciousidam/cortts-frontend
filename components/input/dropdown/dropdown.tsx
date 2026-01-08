import { useEffect, useState } from 'react';
import { Pressable, View, FlatList, TextInput } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../typography';
import { useFloating, flip, offset } from '@floating-ui/react-native';
import { BaseDropdownProps, DropdownOption, useDropdownStyles } from './dropdownStyles';



export const BaseDropdown = <T,>(props: BaseDropdownProps<T>) => {
  const {
    label = '',
    placeholder = 'Select...',
    options = [],
    onSelect,
    multiSelect,
    style,
    icon_position = 'right',
    isSearchable = true,
    anchor,
    required = false,
    error,
    info,
    labelStyle = {},
    selectedValue,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const { scale, widthPixel, heightPixel } = useResponsive();
  const styles = useDropdownStyles();
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);
  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(heightPixel(8)), flip()],
  });

  const searchFunc = (q: string) => {
    setSearch(q);
    // onSearch?.(q);
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleValue = (value: T) => {
    if (multiSelect) {
      const exists = selectedValue?.includes(value);
      const updated = exists
        ? selectedValue?.filter((v) => v !== value)
        : [...(selectedValue ?? []), value];
      onSelect?.(updated ?? []);
    } else {
      onSelect?.(value);
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

  const renderItem = ({ item }: { item: DropdownOption<T> }) => {
    const isSelected = multiSelect ? Array.isArray(selectedValue) && selectedValue.includes(item.value) : selectedValue === item.value;
    return (
      <Pressable
        style={[styles.option, isSelected && styles.selected]}
        onPress={() => toggleValue(item.value)}
      >
        <Typography style={[styles.optionText, { color: !isSelected ? colors.text.default : colors.text.weak }]}>{item.label}</Typography>
        {isSelected && <Ionicons name="checkmark" size={scale(18)} color={colors.brand.blue} />}
      </Pressable>
    );
  };

  const renderValue = (multiSelect
    ? (selectedValue && selectedValue.length
        ? options
            .filter((opt) => selectedValue.includes(opt.value))
            .map((o) => o.label)
            .join(', ')
        : placeholder)
    : (selectedValue ? options.find(opt => opt.value === selectedValue)?.label ?? placeholder : placeholder)
  );

  const isPlaceholder = renderValue === placeholder;

  return (
    <View style={[{ width: '100%', alignSelf: 'flex-start', zIndex: 10000, rowGap: heightPixel(8) }, style]} onLayout={({nativeEvent: {layout}}) => setDropdownWidth(layout.width)}>
      {label && <View style={[styles.sb ]}>
        {Boolean(required) && <Typography variant='medium' size='body' style={styles.required}>*</Typography>}
        <Typography variant='semiBold' size='caption' style={[styles.label, { color: colors.text.default }, labelStyle]}>{label}</Typography>
      </View>}
      {!anchor ? (
          <Pressable
            onPress={showModal}
            style={[styles.selector, icon_position === 'left' ? styles.paddingRight : styles.paddingLeft, { borderColor: colors.neutral.normal }]}
            ref={(node) => refs.setReference(node as any)}
            collapsable={false}
          >
          {icon_position == 'left' && <View style={styles.leftIconView}>{renderIcon()}</View>}
          <Typography style={[{ color: isPlaceholder ? colors.text.weaker : colors.text.default, flex: 1 }, ]}>
            {renderValue}
          </Typography>
          {icon_position == 'right' && <View style={styles.rightIconView}>{renderIcon()}</View>}
        </Pressable>
      ) : anchor({ ref: refs.setReference, value: renderValue, onPress: showModal })}

      {modalVisible && <View  ref={refs.setFloating} collapsable={false} style={[styles.modalContent, { backgroundColor: colors.card, width: dropdownWidth, minWidth: widthPixel(200) }, props.listContainerStyle, floatingStyles]}>
        {isSearchable && <View style={styles.modalHeader}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={searchFunc}
            style={[styles.searchInput, { color: colors.text.default, borderColor: colors.border }]}
            placeholderTextColor={colors.text.weaker}
          />
        </View>}
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => String(item.value)}
          renderItem={renderItem}
          style={{ maxHeight: heightPixel(400) }}
        />
      </View>}
      {error && <Typography style={styles.errorText}>{error}</Typography>}
      {info && <Typography style={styles.infoText}>{info}</Typography>}
    </View>
  );
};
