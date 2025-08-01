// components/Table/provider.tsx

import React, { createContext, useContext } from 'react';
import { TableProps, useTableLogic } from './logic';

type TableContextType<T> = ReturnType<typeof useTableLogic<T>>;

const TableContext = createContext<TableContextType<any> | undefined>(undefined);

export const TableProvider = <T,>({
  children,
  ...props
}: TableProps<T> & { children: React.ReactNode }) => {
  const table = useTableLogic(props);
  return <TableContext.Provider value={table}>{children}</TableContext.Provider>;
};

export const useTableContext = <T,>() => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextType<T>;
};