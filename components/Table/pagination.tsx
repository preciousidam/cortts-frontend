import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ViewStyle, StyleSheet, View, Pressable } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { Typography } from '../typography';
import { Table } from '@tanstack/react-table';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useRoundness } from '@/styleguide/theme/Border';

export type IPaginationProp = {
  table: Table<any>,
  style?: ViewStyle;
};

export const Pagination: React.FC<IPaginationProp> = ({
  table,
  style
}) => {
  const { fontPixel } = useResponsive();
  const styles = useStyles();
  const currentPage = table.getState().pagination.pageIndex + 1;


  const generateOptions = () => {
    if (table.getPageCount() <= 5) {
      return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3, 'hide', table.getPageCount()];
    } else if (currentPage >= table.getPageCount() - 1) {
      return [1, 'hide', table.getPageCount() - 2, table.getPageCount() - 1, table.getPageCount()];
    } else if (currentPage == 3) {
      return [1, 2, currentPage, currentPage + 1, currentPage + 2, 'hide', table.getPageCount()];
    } else if (currentPage == table.getPageCount() - 2) {
      return [1, 'hide', currentPage - 2, currentPage - 1, currentPage, table.getPageCount() - 1, table.getPageCount()];
    } else {
      return [1, 'hide', currentPage - 1, currentPage, currentPage + 1, 'hide', table.getPageCount()];
    }
  };

  return (
    <View style={style}>
      {/* {lastPage > 1 ? (
        <Typography>
          Showing {page * result - (result - 1)} to {page * result} of {total}
        </Typography>
      ) : (
        <Typography>Total {total}</Typography>
      )} */}
      {table.getPageCount() > 0 && (
        <View style={styles.paginationWrapper}>
          <Pressable
            onPress={table.previousPage}
            disabled={!table.getCanPreviousPage()}
            style={[styles.pageButton, styles.previous]}
          >
            <Ionicons
              name="arrow-back-outline"
              color="#767B87"
              size={fontPixel(16)}
            />
            <Typography size='body' variant='semiBold' style={styles.label}>Previous</Typography>
          </Pressable>
          {generateOptions().map((value, i) => (
            <Pressable
              key={i}
              onPress={() =>
                table.setPageIndex((value as number) - 1)
              }
              disabled={value == 'hide' || value == currentPage}
              style={styles.pageButton}
            >
              {value === 'hide' ? (
                <Ionicons
                  name="ellipsis-horizontal-sharp"
                  color="#767B87"
                  size={fontPixel(18)}
                />
              ) : (
                <Typography style={styles.label}>{value}</Typography>
              )}
            </Pressable>
          ))}
          <Pressable onPress={table.nextPage} disabled={!table.getCanNextPage()} style={[styles.pageButton, styles.next]}>
            <Typography size='body' variant='semiBold' style={styles.label}>Next</Typography>
            <Ionicons
              name="arrow-forward-outline"
              color="#767B87"
              size={fontPixel(16)}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};


const useStyles = () => {
  const { widthPixel, heightPixel } = useResponsive();
  const {colors} = useTheme();
  const roundness = useRoundness();
  return StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: heightPixel(16),
    },
    paginationWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card
    },
    pageButton: {
      paddingHorizontal: widthPixel(12),
      paddingVertical: heightPixel(8),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: widthPixel(4),
      borderWidth: widthPixel(.75),
      borderColor: generateColorScale(colors.neutral).lightActive
    },
    pageNumber: {
      fontSize: heightPixel(14),
    },
    previous: {
      ...roundness.m,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderColor: generateColorScale(colors.neutral).lightActive
    },
    next: {
      ...roundness.m,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderColor: generateColorScale(colors.neutral).lightActive
    }
  });
}