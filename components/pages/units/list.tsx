import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { ListHeader } from '@/components/listHeader';
import Table from '@/components/Table';
import { ColumnDef } from '@/components/Table/logic';
import { useTableStyles } from '@/components/Table/style';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetUnitsQueries } from '@/store/units/queries';
import { Unit } from '@/types/models';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ColoredPill } from '@/components/Pill';
import { capitalize } from 'lodash';
import { Typography } from '@/components/typography';
import { format } from 'date-fns';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Image } from 'expo-image';
import PopupMenuV1 from '@/components/PopupMenu';

const all_types: DropdownOption<string>[] = [
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

const Units: React.FC<{}> = () => {
  const styles = useStyles();
  const {bodyText} = useTableStyles();
  const { units, count, isLoading } = useGetUnitsQueries();
  const { widthPixel, isMobile } = useResponsive();
  const { push } = useRouter();
  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({
      headerShown: isMobile,
      title: isMobile ? 'Units' : '',
      headerRight: () => <View>
        <PopupMenuV1
          inHeader
          headerOffset={56}
          anchorVariant='tertiary'
          placement='bottom-end'
          options={[
            { label: 'Create New Unit', onPress: createNewUnit },
            { label: 'Import Units', onPress: () => console.log('Import Units Pressed') }
          ]}
        />
      </View>
    });
  }, [isMobile]);

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
          return <ColoredPill title={capitalize((props.cell.getValue() as string  ?? 'Not Started')?.replaceAll('_', ' '))} color={!props.cell.getValue() || (props.cell.getValue() as string) == 'not_started' ? 'yellow'  : (props.cell.getValue() as string) == 'completed' ? 'green' : 'blue'} />;
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
        header: 'Installment',
        accessorKey: 'installment',
        meta: { width: widthPixel(129) },
        cell: (props) => {
          return <Typography style={bodyText}>{Intl.NumberFormat('en-NG').format(props.cell.getValue() as number)}</Typography>;
        }
      },
      {
        header: 'Payment Status',
        accessorKey: 'payment_summary',
        meta: { width: widthPixel(152) },
        cell: (props) => {
          const paymentSummary = props.cell.getValue() as Unit['payment_summary'];

          let color: 'green' | 'yellow' | 'red' = 'red';
          if (paymentSummary.balanced || paymentSummary.outstanding === 0) {
            color = 'green';
          } else {
            color = 'yellow';
          }
          return <ColoredPill title={color == 'green' ? 'Paid' : 'In Progress'} color={color} />;
        }
      },
      {
        header: 'Handover Date',
        accessorKey: 'handover_date',
        meta: { width: widthPixel(151) },
        cell: props => <Typography>{props.cell.getValue() ? format(props.cell.getValue() as string, 'MMM dd, yyyy') : '--'}</Typography>
      },
    ], [widthPixel])

    const createNewUnit = () => {
    push('./new', { relativeToDirectory: true });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {!isMobile && <ListHeader
          title="Units"
          description="Residential and Commercial housing developments containing multiple units."
          primaryAction={{ title: 'Create New Unit', onPress: createNewUnit }}
          secondaryAction={{ title: 'Import Units', onPress: () => console.log('Import Units Pressed') }}
        />}
        <Table<Unit>
          columns={columns}
          data={units}
          filter={{ field: 'type', options: all_types, multiple: false }}
          onRowSelected={(row) => push(`./${row.id}`, { relativeToDirectory: true })}
          loading={isLoading}
          renderRow={isMobile ? row => <MobileRow row={row} onPress={() => push(`./${row.id}`, {relativeToDirectory: true})} /> : undefined}
          tableContainerStyle={isMobile ? { borderColor: 'transparent', backgroundColor: 'transparent'} : undefined}
          scrollEnabled={isMobile ? false : true}
        />
      </View>
    </ScrollView>
  );
};

export const MobileRow: React.FC<{ row: Unit; onPress: () => void }> = ({ row, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const placeHolder = "eUIW_,0gxURjobyGxBM|W.ae20$eNaWpn%WCX9xZf7oJOEoNt7s.ay"

  return (
    <Pressable onPress={onPress} style={styles.listCard}>
      <Image source={row.images?.[0]} style={styles.image} placeholder={{blurhash: placeHolder}} />
      <View style={styles.view}>
        <Typography variant='bold'>{row.name}</Typography>
        <View style={styles.sb}>
          <Typography color={colors.textWeaker}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(row.amount)}</Typography>
          <Typography  color={colors.textWeaker}>&#x2022;</Typography>
          <ColoredPill title={capitalize(row.development_status)} color={row.development_status === 'in_progress' ? 'yellow' : row.development_status === 'completed' ? 'green' : 'gray'} />
        </View>
      </View>
    </Pressable>
  )
};


const useStyles = () => {
  const {isMobile, widthPixel, heightPixel} = useResponsive();
  const {m} = useRoundness();
  const {colors} = useTheme();

  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(isMobile ? 16 : 32),
      paddingVertical: heightPixel(isMobile ? 16 : 32),
      rowGap: heightPixel(32),
    },
    image: {
      width: '100%',
      height: heightPixel(194),
      borderTopLeftRadius: m.borderRadius,
      borderTopRightRadius: m.borderRadius,
      overflow: 'hidden',
    },
    listCard: {
      ...m,
      backgroundColor: colors.card,
      borderColor: '#E5E5E5',
      width: widthPixel(380),
      marginBottom: heightPixel(12),
    },
    view: {
      flex: 1,
      paddingHorizontal: widthPixel(8),
      paddingVertical: heightPixel(12),
      rowGap: heightPixel(8),
    },
    sb: {
      flexDirection: 'row',
      columnGap: widthPixel(8),
      alignItems: 'center',
    }
  }), [isMobile, widthPixel, heightPixel, m]);
};

export default Units;