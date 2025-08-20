'use client';
import { View, ScrollView } from 'react-native';
import { useTableStyles } from './style';
import { TableProps } from './logic';
import { TableProvider, useTableContext } from './provider';
import { TableBody, TableControl } from './components';

const ViewportSizer = () => {
  const { setWidth } = useTableContext<any>();
  return (
    <View
      // zero-height overlay just to capture viewport width
      style={{ position: 'absolute', left: 0, right: 0, height: 0 }}
      onLayout={({ nativeEvent: { layout: { width } } }) => setWidth(width)}
    />
  );
};

const WidthBoundWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, extendedColumns, equalWidth } = useTableContext<any>();
  const fixed = extendedColumns.reduce(
    (sum: number, col: any) => sum + (col.meta?.width ?? 0),
    0
  );
  const dynamicCount = extendedColumns.filter((c: any) => !c.meta?.width).length;

  const computedTableWidth = Math.max(
    width ?? 0,
    fixed + (dynamicCount > 0 ? dynamicCount * (equalWidth || 0) : 0)
  );

  return <View style={{ width: computedTableWidth }}>{children}</View>;
};


const Table = <T,>(props: TableProps<T>) => {
  const styles = useTableStyles();

  return (
    <TableProvider {...props}>
      <View style={[ props.style]}>
        <ViewportSizer />
        <ScrollView horizontal>
          <WidthBoundWrapper>
            <View style={styles.tableWrapper}>
              <TableControl />
              <TableBody<T> />
            </View>
          </WidthBoundWrapper>
        </ScrollView>
      </View>
    </TableProvider>
  );
}

export default Table;