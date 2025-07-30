'use client';;
import { View, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
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

  const handleRowHover = (rowId: string) => {
    setHoveredRow(rowId);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };


  const handleLoadingRowRender = () => {
    if (props.loading){
      return Array.from({length: pagination.pageSize}, (_, index) => <View style={[styles.row, { minHeight: heightPixel(72)}]} key={index}> {props.loadingComponent ?? 'loading...'} </View>)
    }

    return (table.getRowModel().rows.map(row =>
      props.renderRow ? (
        <React.Fragment key={row.id}>{props.renderRow(row)}</React.Fragment>
      ) : (
        <Pressable key={row.id} style={[styles.row, hoveredRow === row.id && styles.hover]} accessibilityRole="button" accessibilityLabel={`Row ${row.id}`} onPointerEnter={() => handleRowHover(row.id)} onPointerLeave={handleRowLeave} onPress={() => props.onRowSelected?.(row.original)}>
          {row.getVisibleCells().map(cell => (
            <View
              key={cell.id}
              style={[styles.cell, { width: (cell.column.columnDef.meta as ExtendedColumnMeta<T>).width ?? equalWidth, alignItems: (cell.column.columnDef.meta as ExtendedColumnMeta<T>).align }]}
            >
              <Typography style={styles.bodyText}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Typography>
            </View>
          ))}
        </Pressable>
      )
    ))
  }

  const renderPagination = () => {
    // Implement pagination logic here if needed
    return <View style={[styles.footer, {borderBottomWidth: 0}]}>
      <Pagination table={table} />
    </View>;
  }

  return (
    <View style={[{flex: 1}, props.style]}>
      <ScrollView horizontal>
        <View style={styles.tableWrapper}>
          <View style={styles.headerAction}>
            <BaseDropdown
              selectedValues={selectedFilter}
              options={filter?.options}
              placeholder="Filter By"
              style={styles.filter}
              multiSelect={filter.multiple}
              onSelect={handleFilter}
            />
            <BaseTextInput leftIcon="Ionicons.search" value={search} style={styles.search} onChangeText={handleSearch} />
          </View>
          {table.getRowModel().rows.length === 0 ? renderEmpty() :
          <View style={styles.tableContent} onLayout={({nativeEvent: {layout : {width}}}) => {setWidth(width);}}>
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

            <View style={styles.body}>
              {handleLoadingRowRender()}
            </View>
            {renderPagination()}
          </View>}
        </View>
      </ScrollView>
    </View>
  );
}

export default Table;
