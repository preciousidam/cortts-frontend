'use client';;
import { View, ScrollView, Pressable, FlatList, ListRenderItem } from 'react-native';
import React from 'react';
import { flexRender, Row } from '@tanstack/react-table';
import { useResponsive } from '@/hooks/useResponsive';
import { BaseTextInput } from '../input';
import { BaseDropdown } from '../input/dropdown/dropdown';
import { Typography } from '../typography';
import { Image, useImage } from 'expo-image';
import { Pagination } from './pagination';
import { useTableStyles } from './style';
import { ExtendedColumnMeta, TableProps, useTableLogic } from './logic';



const Table = <T,>(props: TableProps<T>) => {
  const styles = useTableStyles();
  const { widthPixel, heightPixel } = useResponsive();

  const emptyImage = useImage(require('@/assets/images/empty.png'), {maxWidth: widthPixel(293), maxHeight: widthPixel(109)});
  const {
    handleFilter,
    handleSearch,
    equalWidth,
    table,
    width,
    setWidth,
    search,
    selectedFilter,
    pagination,
    filter
  } = useTableLogic(props);

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
    <View style={[{flex: 1}, props.style]}>
      <ScrollView horizontal>
        <View style={styles.tableWrapper}>
          <View style={styles.headerAction}>
            <BaseDropdown
              selectedValues={selectedFilter}
              options={props.filter?.options}
              placeholder="Filter By"
              style={styles.filter}
              multiSelect={filter?.multiple}
              onSelect={handleFilter}
            />
            <BaseTextInput leftIcon="Ionicons.search" value={search} style={styles.search} onChangeText={handleSearch} />
          </View>
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
        </View>
      </ScrollView>
    </View>
  );
}

export default Table;