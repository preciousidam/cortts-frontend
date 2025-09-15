import { useEffect, useRef, useState } from 'react';
import { Pressable, View, FlatList, TextInput, ViewStyle } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../typography';
import {
  useFloating,
  autoUpdate,
  flip,
  offset,
  FloatingPortal,
  useInteractions,
  useClick,
} from '@floating-ui/react';
import { BaseDropdownProps, DropdownOption, useDropdownStyles } from './dropdownStyles';
import { generateColorScale } from '@/styleguide/theme/Colors';


export const BaseDropdown = <T,>(props: BaseDropdownProps<T>) => {
  const {
    label = '',
    placeholder = 'Select...',
    options,
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
    asyncOptions
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { colors } = useTheme();
  const { scale, widthPixel, heightPixel } = useResponsive();
  const styles = useDropdownStyles();
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);
  const [hoveredId, setIsHovered] = useState<T | null>(null);
  const [internalOptions, setInternalOptions] = useState<DropdownOption<T>[]>(
    []
  );
  const [shouldLoadMore, setShouldLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastQueryRef = useRef<string>('');
  const requestIdRef = useRef(0);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);

  const dedupeByValue = <V,>(items: DropdownOption<V>[]) => {
    const map = new Map<any, DropdownOption<V>>();
    for (const it of items) map.set(it.value as any, it);
    return Array.from(map.values());
  };

  const { refs, floatingStyles, update, context } = useFloating({
    strategy: 'absolute',
    placement: 'bottom-start',
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

  // const dismiss = useDismiss(context, {enabled: true, escapeKey: true, referencePress: true, referencePressEvent: 'mousedown', outsidePress: true});
  const click = useClick(context, {
    enabled: true,
    event: 'click',
    toggle: true
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    // dismiss,
    click
  ]);

  const searchFunc = (q: string) => {
    setSearch(q);
    // onSearch?.(q);
  }

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
    } else {
      setSearch('');
      setIsHovered(null);
    }
  }, [modalVisible, update]);

  const fetchOptions = useDebouncedCallback(
    async (query: string, loadMore: boolean) => {
      const thisReq = ++requestIdRef.current; // create a simple request token to ignore stale responses
      console.log(
        hasMore,
        'fetching options for',
        query,
        'loadMore:',
        loadMore
      );

      try {
        if (asyncOptions) {
          const queryChanged = lastQueryRef.current !== query;

          // If the query changed, reset list & hasMore before fetching
          if (queryChanged) {
            setInternalOptions([]);
            // setHasMore(true);
            setSkip(0);
          }

          // If we're asked to load more but we already know there's no more, bail
          if (loadMore && !hasMore) return;
          setIsLoading(true);
          const {
            items,
            total,
            hasMore: newHasMore,
            nextSkip
          } = await asyncOptions(query, skip);
          console.log(newHasMore, items, total, nextSkip);

          // Ignore out-of-order responses
          if (thisReq !== requestIdRef.current) return;

          setHasMore(Boolean(newHasMore));

          if (!items || items.length === 0) {
            if (loadMore) setHasMore(false);
            if (queryChanged) setInternalOptions([]);
          } else {
            setSkip(nextSkip);
            if (query && query.length > 0) {
              // Search mode: if query just changed, replace; otherwise append
              setInternalOptions((prev) =>
                queryChanged ? items : dedupeByValue([...prev, ...items])
              );
            } else {
              // Browse mode (no query): always append
              setInternalOptions((prev) => dedupeByValue([...prev, ...items]));
            }
          }

          lastQueryRef.current = query;
        } else {
          // Static options fallback
          const filtered = query
            ? options.filter((opt) =>
                opt.label.toLowerCase().includes(query.toLowerCase())
              )
            : options;

          // For static options we just set the filtered list and mark no further pages
          setInternalOptions(filtered);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
        setShouldLoadMore(false);
      }
    },
    300
  );

  useEffect(() => {
    fetchOptions(search, shouldLoadMore);
  }, [search, shouldLoadMore, options]);

  const renderIcon = () => {
    return <Ionicons name="chevron-down" size={scale(18)} color={'#808080'} />;
  }

  const renderItem = ({ item }: { item: DropdownOption<T> }) => {
    console.log(selectedValue, item.value);
    
    const isSelected = multiSelect ? Array.isArray(selectedValue) && selectedValue.includes(item.value) : selectedValue === item.value;
    const isHovered = item.value == hoveredId
    return (
      <Pressable
        style={[styles.option, isHovered && styles.hovered, isSelected && styles.selected]}
        onPress={() => toggleValue(item.value)}
        onPointerEnter={() => setIsHovered(item.value)}
        onPointerLeave={() => setIsHovered(null)}
      >
        <Typography style={[styles.optionText, { color: !isSelected ? colors.text : colors.textWeak }]}>{item.label}</Typography>
        {isSelected && <Ionicons name="checkmark" size={scale(18)} color={colors.primary} />}
      </Pressable>
    );
  };

  const renderValue = multiSelect
    ? selectedValue && selectedValue.length
      ? internalOptions
          .filter((opt) => selectedValue.includes(opt.value))
          .map((o) => o.label)
          .join(', ')
      : placeholder
    : selectedValue
      ? (internalOptions.find((opt) => opt.value === selectedValue)?.label ??
        placeholder)
      : placeholder;

  const isPlaceholder = renderValue === placeholder;

  return (
    <View style={[{ width: 'auto', alignSelf: 'flex-start', zIndex: 10000, rowGap: heightPixel(8) }, style]} onLayout={({nativeEvent: {layout}}) => setDropdownWidth(layout.width)}>
      {label && <View style={[styles.sb ]}>
        {Boolean(required) && <Typography variant='medium' size='body' style={styles.required}>*</Typography>}
        <Typography variant='semiBold' size='caption' style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Typography>
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
        <Typography style={{ color: isPlaceholder ? colors.textWeaker : colors.text, flex: 1 }}>
          {renderValue}
        </Typography>
        {icon_position == 'right' && <View style={styles.rightIconView}>{renderIcon()}</View>}
      </Pressable>) : anchor({ ref: refs.setReference, value: renderValue, onPress: showModal })}

      <FloatingPortal id='modal-root'>
        {modalVisible && (
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, width: dropdownWidth },
              floatingStyles as ViewStyle, {zIndex: 2147483647}
            ]}
            ref={(node) => refs.setFloating?.(node as any | null)}
            {...getFloatingProps()}
          >
            <FlatList
              data={internalOptions}
              keyExtractor={(item) => String(item.value)}
              renderItem={renderItem}
              stickyHeaderIndices={isSearchable ? [0] : undefined}
              stickyHeaderHiddenOnScroll={true}
              ListHeaderComponent={
                isSearchable ? (
                  <View style={styles.modalHeader}>
                    <TextInput
                      placeholder="Search..."
                      // value={search}
                      onChangeText={(q) => {
                        setSearch(q);
                        setSkip(0); // start new query from page 0
                        setHasMore(false); // let server set the truth after fetch
                        setShouldLoadMore(false);
                        requestIdRef.current++; // invalidate in-flight requests
                      }}
                      style={[
                        styles.searchInput,
                        { color: colors.text, borderColor: colors.neutral }
                      ]}
                      placeholderTextColor={colors.textWeaker}
                    />
                  </View>
                ) : null
              }
              ListFooterComponent={
                <View
                  style={{
                    padding: heightPixel(12),
                    borderColor: generateColorScale(colors.primary).lightActive+"33",
                    borderTopWidth: heightPixel(1),
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    onPress={
                      hasMore ? () => setShouldLoadMore(true) : undefined
                    }
                    variant="semiBold"
                    size="body"
                    style={{ color: colors.primary, textAlign: 'center' }}
                  >
                    {isLoading
                      ? 'Loading...'
                      : hasMore
                        ? 'Load more...'
                        : 'No more options'}
                  </Typography>
                </View>
              }
              style={{ maxHeight: heightPixel(400) }}
              onEndReached={() =>
                !isLoading && hasMore && setShouldLoadMore(true)
              }
            />
          </View>
        )}
      </FloatingPortal>
      {error && <Typography style={styles.errorText}>{error}</Typography>}
      {info && <Typography style={styles.infoText}>{info}</Typography>}
    </View>
  );
};
