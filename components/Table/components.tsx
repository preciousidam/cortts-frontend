import { FlatList, ListRenderItem, Pressable, View } from "react-native"
import { BaseDropdown } from "../input/dropdown/dropdown"
import React from "react"
import { useTableStyles } from "./style"
import { useTableContext } from "./provider"
import { BaseTextInput } from "../input"
import { Image, useImage } from "expo-image"
import { Typography } from "../typography"
import { Pagination } from "./pagination"
import { flexRender, Row } from "@tanstack/react-table"
import { ExtendedColumnMeta } from "./logic"
import { useResponsive } from "@/hooks/useResponsive"

export const TableControl: React.FC = () => {
  const styles = useTableStyles();
  const { handleFilter, handleSearch, search, selectedFilter, filter } = useTableContext();
  return (
    <View style={styles.headerAction}>
      {filter.multiple && <BaseDropdown
        selectedValue={selectedFilter as string[]}
        options={filter?.options}
        placeholder="Filter By"
        style={styles.filter}
        onSelect={handleFilter}
        multiSelect={true}
      />}
      {!filter.multiple && <BaseDropdown
        selectedValue={selectedFilter as string}
        options={filter?.options}
        placeholder="Filter By"
        style={styles.filter}
        onSelect={handleFilter}
        multiSelect={false}
      />}
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
  const { widthPixel, heightPixel } = useResponsive();
  const { setWidth, table, equalWidth, pagination, ...props } = useTableContext<T>();
  const emptyImage = useImage(require('@/assets/images/empty.png'), {maxWidth: widthPixel(293), maxHeight: widthPixel(109)});

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
    if (props.loading){
      return <View style={[styles.row, { minHeight: heightPixel(72)}]} key={index}> {props.loadingComponent ?? 'loading...'} </View>
    }
    return props.renderRow ? (
        <React.Fragment key={item.id}>{props.renderRow(item)}</React.Fragment>
      ) : (
      <Pressable key={item.id} style={[styles.row]} accessibilityRole="button" accessibilityLabel={`Row ${item.id}`} onPress={() => props.onRowSelected?.(item.original)}>
        {item.getVisibleCells().map(cell => (
          <View
            key={cell.id}
            style={[styles.cell, { width: ((cell.column.columnDef.meta as ExtendedColumnMeta<T>)?.width ?? equalWidth), alignItems: ((cell.column.columnDef.meta as ExtendedColumnMeta<T>)?.align ?? 'flex-start') }]}
          >
            <Typography style={styles.bodyText}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Typography>
          </View>
        ))}
      </Pressable>
    )
  }

  return (
    <View style={styles.tableContent} onLayout={({nativeEvent: {layout : {width}}}) => {setWidth(width);}}>
      <FlatList
        data={table.getRowModel().rows}
        keyExtractor={(item, index) => `${item.id ?? index}`}
        renderItem={renderItem}
        stickyHeaderIndices={[0, 1]}
        stickyHeaderHiddenOnScroll={true}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderPagination}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (table.getCanNextPage()) {
            table.nextPage();
          }
        }}
        initialNumToRender={pagination.pageSize}
        maxToRenderPerBatch={pagination.pageSize}
        windowSize={5}
      />
    </View>
  )
}