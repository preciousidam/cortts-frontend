import { useResponsive } from "@/hooks/useResponsive";
import { ColumnDef as TanstackColumnDef, ColumnMeta, FilterFn, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, TableOptions, useReactTable } from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";
import { ViewStyle } from "react-native";

export type ColumnDef<TData> = TanstackColumnDef<TData, unknown> & {
  accessorKey?: string; // Explicitly add accessorKey
  meta?: ExtendedColumnMeta<TData>;
};

export type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  renderRow?: (row: ReturnType<ReturnType<typeof useReactTable<T>>['getRowModel']>['rows'][number]) => React.ReactNode;
  emptyStateText?: string;
  onSearch?: (text: string) => void;
  loading?: boolean;
  loadingComponent?: ReactNode; // Loading skeleton component
  options?: TableOptions<T>;
  onRowSelected?: (row: T) => void;
  filter?: {
    field: keyof T;
    options: { label: string; value: string }[];
    multiple?: boolean
  };
  style?: ViewStyle;
};

export type ExtendedColumnMeta<T> = ColumnMeta<T, unknown> & { width?: number, align?: ViewStyle['alignItems'] };

const includesSome: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (filterValue.length == 0) return true
  return filterValue.includes(row.getValue(columnId));
};

const defaultFilter = {
  field: '' as any,
  options: [],
  multiple: false
}

export const useTableLogic = <T,>({ columns, data, renderRow, emptyStateText, onSearch, loading, loadingComponent, options = {} as TableOptions<T>, onRowSelected, filter = defaultFilter, style }: TableProps<T>) => {
  const [width, setWidth] = useState<number>();
  const { widthPixel } = useResponsive();
  const [search, setSearch] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [pagination, setPagination] = useState({
      pageIndex: 0, //initial page index
      pageSize: 10, //default page size
    });

    const extendedColumns = columns.map((column) => {
      const isFilterTarget = column.accessorKey?.toString() === filter.field;
      return {
        ...column,
        accessorKey: column.accessorKey || '', // Ensure accessorKey is defined
        meta: {
          ...column.meta,
          width: column.meta?.width,
          align: column.meta?.align,
        },
        ...(isFilterTarget && filter.multiple ? { filterFn: includesSome } : {}), // Use the actual filter function
      } as ColumnDef<T>; // Explicitly cast to ColumnDef<T>
  });

  const table = useReactTable({
    ...options,
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: 10,
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
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



  const handleSearch  = (text: string) => {
    setSearch(text);
    setGlobalFilter(text);
    onSearch?.(text);
  }

  const handleFilter = (selected: string[]) => {
    const column = table.getColumn(filter.field as string);
    if (!column) {
      console.warn(`Column ${filter.field as string} not found in table columns.`);
      setSelectedFilter(selected);
      return;
    }
    column.setFilterValue(selected);
    setSelectedFilter(selected);
  }

  return {
    handleFilter,
    handleSearch,
    equalWidth,
    table,
    width,
    setWidth,
    search,
    globalFilter,
    selectedFilter,
    pagination,
    setPagination,
    extendedColumns,
    filter
  }
}