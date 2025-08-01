import { useEffect, useState } from 'react';
import { Pressable, View, FlatList, TextInput, ViewStyle } from 'react-native';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../typography';
import { useFloating, autoUpdate, flip, offset, FloatingPortal, useDismiss, useInteractions } from '@floating-ui/react';
import { BaseDropdownProps, DropdownOption, useDropdownStyles } from './dropdownStyles';
import { generateColorScale } from '@/styleguide/theme/Colors';


export const BaseDropdown = <T,>(props: BaseDropdownProps<T>) => {
  const {
    label = '',
    placeholder = 'Select...',
    options = [],
    onSelect,
    multiSelect,
    style,
    icon_position = 'left',
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
  const { scale, fontPixel, heightPixel } = useResponsive();
  const styles = useDropdownStyles();
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);

  const { refs, floatingStyles, update, context } = useFloating({
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [offset(heightPixel(8)), flip()],
    open: modalVisible,
    onOpenChange(nextOpen, event, reason) {
      setModalVisible(nextOpen);

      // Other ones include 'reference-press' and 'ancestor-scroll'
      // if enabled.
      if (reason === 'escape-key' || reason === 'outside-press') {
        console.log('Dismissed');
      }
    },
  });

  const dismiss = useDismiss(context, {enabled: true, escapeKey: true, referencePress: true, referencePressEvent: 'pointerdown', outsidePress: true});

  const {getReferenceProps, getFloatingProps} = useInteractions([
    dismiss,
  ]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleValue = (value: T) => {
      if (multiSelect) {
        const exists = Array.isArray(selectedValue) && selectedValue.includes(value);
        const updated: T[] = exists
          ? selectedValue?.filter((v: T) => v !== value) ?? []
          : [...(selectedValue ?? []), value];
        onSelect?.(updated);
      } else {
        onSelect?.(value);
        setModalVisible(false);
      }
    };

  const showModal = () => {
    setModalVisible(prev => !prev);
  }

  useEffect(() => {
    if (modalVisible){
      update();
    }
  }, [modalVisible]);

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
        <Typography style={[styles.optionText, { color: !isSelected ? colors.text : colors.textWeak }]}>{item.label}</Typography>
        {isSelected && <Ionicons name="checkmark" size={scale(18)} color={colors.primary} />}
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

  console.log(renderValue,selectedValue, options, placeholder);
  

  return (
    <View style={[{ width: 'auto', alignSelf: 'flex-start', zIndex: 10000, rowGap: heightPixel(8) }, style]} onLayout={({nativeEvent: {layout}}) => setDropdownWidth(layout.width)}>
      {label && <View style={[styles.sb ]}>
        {Boolean(required) && <Typography variant='medium' size='body' style={styles.required}>*</Typography>}
        <Typography variant='medium' size='body' style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Typography>
      </View>}
      {!anchor ? (
        <Pressable
          onPress={showModal}
          style={[styles.selector, icon_position === 'left' ? styles.paddingRight : styles.paddingLeft, { borderColor: error ? colors.notification : generateColorScale(colors.neutral).normalBase }]}
          ref={(node) => refs.setReference(node as any)}
          collapsable={false}
          {...getReferenceProps()}
        >
        {icon_position == 'left' && <View style={styles.leftIconView}>{renderIcon()}</View>}
        <Typography style={{ color: colors.text, flex: 1 }}>
          {renderValue}
        </Typography>
        {icon_position == 'right' && <View style={styles.rightIconView}>{renderIcon()}</View>}
      </Pressable>) : anchor({ ref: refs.setReference, value: renderValue, onPress: showModal })}

      <FloatingPortal>
        {modalVisible && (
          <View
            style={[styles.modalContent, { backgroundColor: colors.card, width: dropdownWidth }, floatingStyles as ViewStyle]}
            ref={(node) => refs.setFloating?.(node as any | null)}
            {...getFloatingProps()}
          >
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
            keyExtractor={(item) => String(item.value)}
            renderItem={renderItem}
            style={{ maxHeight: heightPixel(400) }}
          />
        </View>)}
      </FloatingPortal>
      {error && <Typography style={styles.errorText}>{error}</Typography>}
      {info && <Typography style={styles.infoText}>{info}</Typography>}
    </View>
  );
};
