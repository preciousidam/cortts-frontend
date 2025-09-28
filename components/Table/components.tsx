import { FlatList, ListRenderItem, Platform, Pressable, View } from "react-native"
import { BaseDropdown } from "../input/dropdown/dropdown"
import React, { useState } from "react"
import { useTableStyles } from "./style"
import { useTableContext } from "./provider"
import { BaseTextInput } from "../input"
import { Image, useImage } from "expo-image"
import { Typography } from "../typography"
import { Pagination } from "./pagination"
import { flexRender, Row } from "@tanstack/react-table"
import { ExtendedColumnMeta } from "./logic"
import { useResponsive } from "@/hooks/useResponsive"
import { Button } from "../button"
import PopupMenuV1 from "../PopupMenu"
import { ColoredPill } from "../Pill"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/styleguide/theme/ThemeContext"

export const TableControl: React.FC = () => {
  const styles = useTableStyles();
  const { handleFilter, handleSearch, search, selectedFilter, filter } = useTableContext();
  const { isMobile, widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();

  if (isMobile) {
    return (
      <View style={{ gap: widthPixel(8) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: heightPixel(8) }}>
          <BaseTextInput
            leftIcon="Ionicons.search"
            value={search}
            style={{ ...styles.search, width: widthPixel(326) }}
            onChangeText={(text: string) => handleSearch(text)}
          />
          <PopupMenuV1
            anchor={props => <Button iconOnly icon="Ionicons.filter" {...props} variant="secondary" />}
            options={filter.options.map(option => ({ label: option.label, onPress: () => handleFilter(option.value) }))}
          />
        </View>
        {typeof selectedFilter == "string" && <ColoredPill
          title={selectedFilter}
          color="blue"
          style={{alignSelf: 'flex-start'}}
          rightIcon={<Ionicons name="close" size={16} color={colors.primary} onPress={() => handleFilter()} />}
        />}
        {Array.isArray(selectedFilter) && selectedFilter.length > 0 && <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: widthPixel(8)}}>
          {selectedFilter.map((filter) => <ColoredPill
            key={filter}
            title={filter}
            color="blue"
            style={{alignSelf: 'flex-start'}}
            rightIcon={<Ionicons name="close" size={16} color={colors.primary} onPress={() => handleFilter()} />}
          />)}
        </View>}
      </View>
    )
  }
  return (
    <View style={styles.headerAction}>
      {filter.multiple ? (
        <BaseDropdown
          multiSelect={true}
          selectedValue={selectedFilter as string[]}
          options={filter?.options}
          placeholder="Filter By"
          style={styles.filter}
          onSelect={handleFilter}
        />
      ) : (
        <BaseDropdown
          selectedValue={selectedFilter as string}
          options={filter?.options}
          placeholder="Filter By"
          style={styles.filter}
          onSelect={handleFilter}
        />
      )}
      <BaseTextInput
        leftIcon="Ionicons.search"
        value={search}
        style={styles.search}
        onChangeText={(text: string) => handleSearch(text)}
      />
    </View>
  )
}

export const TableBody = <T,>(): React.ReactElement => {
  const styles = useTableStyles();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { widthPixel, heightPixel, isMobile } = useResponsive();
  const { setWidth, table, equalWidth, pagination, scrollEnabled, ...props } = useTableContext<T>();
  const emptyImage = useImage(require('@/assets/images/empty.png'), {maxWidth: widthPixel(293), maxHeight: widthPixel(109)});
  const showHeader = !isMobile || scrollEnabled;
  const showFooter = !isMobile || scrollEnabled;
  const stickyIndices = scrollEnabled ? [0, 1] : undefined;

  const renderEmpty = () => (
      <View style={styles.emptyView}>
        {emptyImage && (
          <Image
            source={emptyImage}
            style={styles.emptyImage}
            contentFit="contain"
          />
        )}
        <Typography>{props.emptyStateText || 'No data available yet!'}</Typography>
      </View>
    )

  const renderPagination = () => {
    // Implement pagination logic here if needed
    return <View style={[styles.footer, {borderBottomWidth: 0}]}>
      <Pagination table={table} />
    </View>;
  }

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {table.getHeaderGroups().map(headerGroup => (
        <View key={headerGroup.id} style={styles.row}>
          {headerGroup.headers.map(header => (
            <View
              key={header.id}
              style={[
                styles.cell,
                styles.headerCell, { width: (header.column.columnDef.meta as ExtendedColumnMeta<T>).width ?? equalWidth, alignItems: (header.column.columnDef.meta as ExtendedColumnMeta<T>).align }
              ]}
            >
              {header.isPlaceholder ? null : (
                <Typography style={styles.headerText} variant='bold' size='body'>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Typography>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  )

  const renderItem: ListRenderItem<Row<T>> = ({ item, index }) => {
    const isHovered = hoveredRow === item.id;
    if (props.loading){
      return <View style={[styles.row, { minHeight: heightPixel(72)}]} key={index}> {props.loadingComponent ?? 'loading...'} </View>
    }
    return props.renderRow ? (
      <React.Fragment key={item.id}>{props.renderRow(item.original)}</React.Fragment>
    ) : (
      <Pressable key={item.id} style={[styles.row, isHovered && styles.hover]} accessibilityRole="button" accessibilityLabel={`Row ${item.id}`} onPress={() => props.onRowSelected?.(item.original)} onPointerEnter={() => setHoveredRow(item.id)} onPointerLeave={() => setHoveredRow(null)}>
        {item.getVisibleCells().map(cell => {
          const colMeta = cell.column.columnDef.meta as ExtendedColumnMeta<T> | undefined;
          const width = colMeta?.width ?? equalWidth;
          const align = colMeta?.align ?? 'flex-start';

          const hasCustomCell = colMeta?.hasCustomCell;

          return (
            <View key={cell.id} style={[styles.cell, { width, alignItems: align }]}>
              {hasCustomCell ? (
                // Custom cell defined: render it
                flexRender(cell.column.columnDef.cell, cell.getContext())
              ) : (
                // No custom cell: render a Typography-wrapped string
                <Typography variant="regular" size="body" style={styles.bodyText}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Typography>
              )}
            </View>
          );
        })}
      </Pressable>
    )
  }

  return (
    <View style={[styles.tableContent, props.tableContainerStyle]} >
      <FlatList
        data={table.getRowModel().rows}
        keyExtractor={(item, index) => `${item.id ?? index}`}
        renderItem={renderItem}
        stickyHeaderIndices={stickyIndices}
        stickyHeaderHiddenOnScroll={true}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={showFooter ? renderPagination : null}
        ListHeaderComponent={showHeader ? renderHeader : null}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled={Platform.OS == 'web' ? true : !scrollEnabled ? false : true}
        scrollEnabled={Platform.OS == 'web' ? true : scrollEnabled}
        onEndReached={scrollEnabled ? () => {
          if (table.getCanNextPage()) {
            table.nextPage?.();
          }
        } : undefined}
        initialNumToRender={pagination.pageSize}
        maxToRenderPerBatch={pagination.pageSize}
        windowSize={5}
      />
    </View>
  )
}