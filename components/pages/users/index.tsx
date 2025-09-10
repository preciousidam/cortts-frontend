import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { ListHeader } from '@/components/listHeader';
import Table from '@/components/Table';
import { useTableStyles } from '@/components/Table/style';
import { useResponsive } from '@/hooks/useResponsive';
import { User } from '@/types/models';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ColoredPill } from '@/components/Pill';
import { capitalize } from 'lodash';
import { Typography } from '@/components/typography';
import { format } from 'date-fns';
import { createColumnHelper } from '@tanstack/react-table';
import { useGetUsersQuery } from '@/store/users/queries';

const all_types: DropdownOption<string>[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Client", value: "CLIENT" },
  { label: "Agent", value: "AGENT" },
].sort((a, b) => a.label.localeCompare(b.label))

const Users: React.FC = () => {
  const styles = useStyles();
  const {bodyText} = useTableStyles();
  const { users, count, isLoading } = useGetUsersQuery();
  const { widthPixel, isMobile } = useResponsive();
  const { push } = useRouter();

  const columnHelper = createColumnHelper<User>();

  const columns =  useMemo(() => [
      columnHelper.accessor('fullname', {
        header: 'Full Name',
        id: 'fullname',
        meta: { width: widthPixel(227) }
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        id: 'email',
        meta: { width: widthPixel(204) },
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        id: 'phone',
        meta: { width: widthPixel(195) },
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        id: 'role',
        meta: { width: widthPixel(155) },
        cell: (props) => {
          return <Typography style={bodyText}>{capitalize(props?.cell.getValue() as string)}</Typography>;
        }
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        id: 'status',
        meta: { width: widthPixel(170) },
        cell: props => {
          return <ColoredPill title={props.cell.getValue() ? 'Active' : 'Inactive'} color={props.cell.getValue() ? 'green' : 'gray'} />;
        }
      }),
      columnHelper.accessor('created_at', {
        header: 'Date Added',
        id: 'created_at',
        meta: { width: widthPixel(150) },
        cell: props => {
          return <Typography style={bodyText}>{format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy')}</Typography>;
        }
      }),
    ], [widthPixel])

    const createNewUser = () => {
    push('./new', { relativeToDirectory: true });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {!isMobile && <ListHeader
          title="User Management"
          description="Manage users and their permissions."
          primaryAction={{ title: 'Create New User', onPress: createNewUser }}
        />}
        <Table<User>
          columns={columns}
          data={users}
          filter={{ field: 'role', options: all_types, multiple: false }}
          onRowSelected={(row) => push(`./${row.id}`, { relativeToDirectory: true })}
          loading={isLoading}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = () => {
  const {isMobile, widthPixel, heightPixel} = useResponsive();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(isMobile ? 16 : 32),
      paddingVertical: heightPixel(isMobile ? 16 : 32),
      rowGap: heightPixel(32)
    },
  });
};

export default Users;