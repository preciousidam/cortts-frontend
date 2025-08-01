'use client';;
import { View, ScrollView } from 'react-native';
import { useTableStyles } from './style';
import { TableProps } from './logic';
import { TableProvider } from './provider';
import { TableBody, TableControl } from './components';



const Table = <T,>(props: TableProps<T>) => {
  const styles = useTableStyles();

  return (
    <TableProvider {...props}>
      <View style={[{flex: 1}, props.style]}>
        <ScrollView horizontal>
          <View style={styles.tableWrapper}>
            <TableControl />
            <TableBody<T> />
          </View>
        </ScrollView>
      </View>
    </TableProvider>
  );
}

export default Table;