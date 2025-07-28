'use client';;
import { View, ScrollView, StyleSheet, Pressable, ViewStyle } from 'react-native';
import React, { ReactNode, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  ColumnMeta,
  TableOptions,
  getFilteredRowModel,
  FilterFn,
  getPaginationRowModel
} from '@tanstack/react-table';
import { useResponsive } from '@/hooks/useResponsive';
import { BaseTextInput } from '../input';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { BaseDropdown } from '../input/dropdown';
import { Typography } from '../typography';
import { Image, useImage } from 'expo-image';
import { Pagination } from './pagination';

export type ExtendedColumnMeta<T> = ColumnMeta<T, unknown> & { width?: number, align?: ViewStyle['alignItems'] };

export type TableProps<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  renderRow?: (row: ReturnType<ReturnType<typeof useReactTable<T>>['getRowModel']>['rows'][number]) => React.ReactNode;
  emptyStateText?: string;
  onSearch?: (text: string) => void;
  loading?: boolean;
  loadingComponent?: ReactNode; // Loading skeleton component
  options?: TableOptions<T>;
  onRowSelected?: () => void;
  filter?: {
    field: string;
    options: { label: string; value: string }[];
    multiple: boolean
  };
  style?: ViewStyle;
};

const includesSome: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (filterValue.length == 0) return true
  return filterValue.includes(row.getValue(columnId));
};

const defaultFilter = {
  field: '',
  options: [],
  multiple: false
}

const Table = <T,>({ columns, data, renderRow, emptyStateText, onSearch, loading, loadingComponent, options = {} as TableOptions<T>, onRowSelected, filter = defaultFilter, style }: TableProps<T>) => {
  const styles = useTableStyles();
  const { widthPixel, heightPixel } = useResponsive();
  const [width, setWidth] = useState<number>();
  const emptyImage = useImage(require('@/assets/images/empty.png'), {maxWidth: widthPixel(293), maxHeight: widthPixel(109)});
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const extendedColumns = columns.map(column => {
    // @ts-ignore
  const isFilterTarget = column.accessorKey === filter.field;
  return {
    ...column,
    meta: {
      ...column.meta,
      width: (column.meta as ExtendedColumnMeta<T>)?.width,
      align: (column.meta as ExtendedColumnMeta<T>)?.align,
    },
    ...(isFilterTarget && filter.multiple ? { filterFn: 'includesSome' } : {}),
  };
}) as ColumnDef<T, any>[];

  const table = useReactTable({
    ...options,
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: 10,
    state: {
      ...options?.state,
      pagination,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      includesSome
    }
  });

  const computeEqualWidth = () => {
    const totalWidth = width || widthPixel(1440);

    const fixedWidthSum = columns.reduce((sum, col) => {
      const colWidth = (col.meta as ExtendedColumnMeta<T>)?.width;
      return colWidth ? sum + colWidth : sum;
    }, 0);


    // Count how many columns do NOT have a defined width
    const dynamicColumns = columns.filter(
      col => !(col.meta && (col.meta as ExtendedColumnMeta<T>)?.width)
    );

    const dynamicCount = dynamicColumns.length || 1; // Prevent divide by 0

    const remainingWidth = totalWidth - fixedWidthSum;
    return remainingWidth / dynamicCount;
  };

  const equalWidth = useMemo(computeEqualWidth, [columns, width]);

  const renderEmpty = () => (
    <View style={styles.emptyView}>
      {emptyImage && (
        <Image
          source={emptyImage}
          style={styles.emptyImage}
          contentFit="contain"
        />
      )}
      <Typography>{emptyStateText || 'No data available yet!'}</Typography>
    </View>
  )

  const handleRowHover = (rowId: string) => {
    setHoveredRow(rowId);
  };

  const handleRowLeave = () => {
    setHoveredRow(null);
  };

  const handleSearch  = (text: string) => {
    setSearch(text);
    setGlobalFilter(text);
    onSearch?.(text);
  }

  const handleFilter = (selected: string[]) => {
    const column = table.getColumn(filter.field);
    if (!column) {
      console.warn(`Column ${filter.field} not found in table columns.`);
      setSelectedFilter(selected);
      return;
    }
    column.setFilterValue(selected);
    setSelectedFilter(selected);
  }

  const handleLoadingRowRender = () => {
    if (loading){
      return Array.from({length: pagination.pageSize}, (_, index) => <View style={[styles.row, { minHeight: heightPixel(72)}]} key={index}> {loadingComponent ?? 'loading...'} </View>)
    }

    return (table.getRowModel().rows.map(row =>
      renderRow ? (
        <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
      ) : (
        <Pressable key={row.id} style={[styles.row, hoveredRow === row.id && styles.hover]} accessibilityRole="button" accessibilityLabel={`Row ${row.id}`} onPointerEnter={() => handleRowHover(row.id)} onPointerLeave={handleRowLeave} onPress={onRowSelected}>
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
    <View style={[{flex: 1}, style]}>
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

export const useTableStyles = () => {
  const { width, widthPixel, heightPixel, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const {colors} = useTheme();
  return StyleSheet.create({
    tableWrapper: {
      width: widthPixel(1104),
      rowGap: heightPixel(8)
    },
    tableContent: {
      ...roundness.m,
      borderColor: generateColorScale(colors.neutral).lightActive,
      backgroundColor: colors.card
    },
    headerRow: {
      width: '100%',
    },
    headerCell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(20)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      zIndex: -1,
      borderBottomWidth: 1,
      borderBottomColor: generateColorScale(colors.neutral).lightActive
    },
    cell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(16),
    },
    headerText: {
      color: colors.textWeak,
      fontSize: fontPixel(14),
    },
    bodyText: {
      color: colors.text,
      fontSize: fontPixel(13),
    },
    body: {
    },
    headerAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    search: {
      width: widthPixel(404)
    },
    filter: {
      width: widthPixel(200)
    },
    emptyView: {
      width: widthPixel(1104),
      height: heightPixel(764),
      justifyContent: 'center',
      alignItems: 'center',
      ...roundness.m,
      borderColor: generateColorScale(colors.neutral).lightActive,
      backgroundColor: colors.card,
      rowGap: heightPixel(22)
    },
    emptyImage: {
      width: widthPixel(111),
      height: widthPixel(109),
    },
    hover: {
      backgroundColor: '#EDF9FF',
    },
    footer: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(16),
      alignItems: 'flex-end',
    }
  });
};