import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { Breadcrumb } from '@/components/breadcrumb';
import { Typography } from '@/components/typography';
import { ColoredPill, ColorIndicator } from '@/components/Pill';
import { capitalize } from 'lodash';
import { ColumnDef } from '@/components/Table/logic';
import { Unit } from '@/types/models';
import Table from '@/components/Table';
import { Image } from 'expo-image';
import generateAvatarImage from '@/utilities/generateAvatarImage';
import { useTableStyles } from '@/components/Table/style';
import { format } from 'date-fns';
import PopupMenuV1 from '@/components/PopupMenu';
import { useGetUser } from '@/store/users/queries';
import { Button } from '@/components/button';

const purpose: DropdownOption<string>[] = [
  { label: "Detached", value: "Detached" },
  { label: "Semi Detached", value: "Semi-Detached" },
  { label: "Terraced", value: "Terraced" },
  { label: "End Of Terrace", value: "End-of-Terrace" },
  { label: "Bungalow", value: "Bungalow" },
  { label: "Maisonette", value: "Maisonette" },
  { label: "Flat", value: "Flat" },
  { label: "Duplex", value: "Duplex" },
  { label: "Triplex", value: "Triplex" },
  { label: "Penthouse", value: "Penthouse" },
  { label: "Studio", value: "Studio" },
  { label: "Cottage", value: "Cottage" },
  { label: "Villa", value: "Villa" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Chalet", value: "Chalet" }
].sort((a, b) => a.label.localeCompare(b.label))

const User: React.FC = () => {
  const {user_id} = useLocalSearchParams<{user_id: string}>();
  const styles = useStyles();
  const { bodyText } = useTableStyles();
  const { widthPixel } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back, push } = useRouter();
  const {user, isLoading} = useGetUser(user_id);

  const columns: ColumnDef<Unit>[] =  useMemo(() => [
    {
      header: 'Unit Name',
      accessorKey: 'name',
      meta: { width: widthPixel(196) }
    },
    {
      header: 'Dev Status',
      accessorKey: 'development_status',
      meta: { width: widthPixel(146) },
      cell: props => {
        return <ColoredPill title={capitalize(props.cell.getValue() as string ?? 'Not Started').replaceAll('_', ' ')} color={!props.cell.getValue() || (props.cell.getValue() as string) == 'not_started' ? 'yellow'  : (props.cell.getValue() as string) == 'completed' ? 'green' : 'blue'} />;
      }
    },
    {
      header: 'Unit Type',
      accessorKey: 'type',
      meta: { width: widthPixel(164) },
      cell: props => <Typography style={bodyText}>{capitalize((props.cell.getValue() as string).replaceAll('_', ' '))}</Typography>
    },

    {
      header: 'Amount',
      accessorKey: 'amount',
      meta: { width: widthPixel(163) },
      cell: (props) => {
        return <Typography style={bodyText}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(props.cell.getValue() as number)}</Typography>;
      }
    },
    {
      header: 'Installments',
      accessorKey: 'installment',
      meta: { width: widthPixel(139) },
      cell: (props) => {
        return <Typography style={bodyText}>{Intl.NumberFormat('en-NG').format(props.cell.getValue() as number)}</Typography>;
      }
    },
    {
      header: 'Payment Plan',
      accessorKey: 'payment_plan',
      meta: { width: widthPixel(142) },
      cell: props => props.cell.getValue() ? "Yes" : "No"
    },
    {
      header: 'Handover Date',
      accessorKey: 'handover_date',
      meta: { width: widthPixel(151) },
      cell: props => <Typography>{props.cell.getValue() ? format(props.cell.getValue() as string, 'MMM dd, yyyy') : '--'}</Typography>
    },
  ], [])

  const onSelect = (option: 'edit' | 'delete') => {
    if (option == 'edit') {
      push('./edit', { relativeToDirectory: true })
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <Breadcrumb />
          <PopupMenuV1
            options={[
              { label: 'Edit User', onPress: () => onSelect('edit') },
              { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
            ]}
          />
        </View>
        <View style={styles.formArea}>
          <View style={styles.row}>
            <Image
              placeholder={generateAvatarImage({ name: user?.fullname ?? '', size: widthPixel(88) })}
              style={styles.image}
              // source={{ uri: user?.avatar_url ?? '' }}
            />
            <View style={styles.header}>
              <View style={styles.ctaView}>
                <Typography size="subtitle" variant='bold' >{user?.fullname}</Typography>
                <ColoredPill title={user?.role ?? ''} color='blue' showIndicator={false} />
                <ColoredPill title={user?.is_active ? 'Active' : 'Inactive'} color={user?.is_active  ? 'green' : 'gray'} />
              </View>

              <View style={styles.smallGap}>
                <Typography color={colors.brand.blue}>{capitalize(user?.email)}</Typography>
                <ColorIndicator color='gray' />
                <Typography color={colors.text.weak}>{user?.phone}</Typography>
              </View>
            </View>
            <Button title="Edit" onPress={() => onSelect('edit')} rightIcon="Ionicons.pencil" />
          </View>
        </View>
        <Table<Unit>
          columns={columns}
          data={user?.units ?? []}
          filter={{ field: 'type', options: purpose }}
          loading={isLoading}
          onRowSelected={unit => push(`/Units/${unit.id}`)}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = () => {
  const { fontPixel, widthPixel, heightPixel } = useResponsive();
  const { colors, shadow } = useTheme();
  const { m, large, circle } = useRoundness();

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(32),
      paddingVertical: heightPixel(32),
      rowGap: heightPixel(40),
    },
    formArea: {
      rowGap: heightPixel(24),
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(24),
      ...large,
      borderColor: colors.neutral.lightHover,
      ...shadow(heightPixel(2), widthPixel(8))
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: widthPixel(12),
    },
    header: {
      rowGap: heightPixel(8),
      flex: 1,
    },
    ctaView: {
      columnGap: widthPixel(24),
      flexDirection: 'row',
      alignItems: 'center'
    },
    smallGap: {
      columnGap: widthPixel(12),
      flexDirection: 'row',
      alignItems: 'center'
    },
    blue: {
      color: colors.brand.blue
    },
    input: {
      flex: 1,
    },
    cancel: {
      width: widthPixel(151)
    },
    card: {
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(12),
      paddingVertical: heightPixel(16),
      ...m,
      borderColor: colors.neutral.lightActive,
      ...shadow(heightPixel(1), m.borderRadius),
      rowGap: heightPixel(4),
      flex: 1,
    },
    cardValue: {
      fontSize: fontPixel(20),
      color: colors.text.default,
    },
    image: {
      width: widthPixel(88),
      height: widthPixel(88),
      ...circle
    }
  });
};

export default User;