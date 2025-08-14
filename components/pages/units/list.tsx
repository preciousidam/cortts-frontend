import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { ListHeader } from '@/components/listHeader';
import Table from '@/components/Table';
import { ColumnDef } from '@/components/Table/logic';
import { useTableStyles } from '@/components/Table/style';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetUnitsQueries } from '@/store/units/queries';
import { Unit } from '@/types/models';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ColoredPill } from '@/components/Pill';
import { capitalize } from 'lodash';
import { Typography } from '@/components/typography';
import { format } from 'date-fns';

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

const Units: React.FC = () => {
  const styles = useStyles();
  const {bodyText} = useTableStyles();
  const { units, count, isLoading } = useGetUnitsQueries();
  const { widthPixel } = useResponsive();
  const { push } = useRouter();

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
    ], [])

    const createNewUnit = () => {
    push('./new', { relativeToDirectory: true });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ListHeader
          title="Units"
          description="Residential and Commercial housing developments containing multiple units."
          primaryAction={{ title: 'Create New Unit', onPress: createNewUnit }}
          secondaryAction={{ title: 'Import Units', onPress: () => console.log('Import Units Pressed') }}
        />
        <Table<Unit>
          columns={columns}
          data={units}
          filter={{ field: 'type', options: all_types, multiple: false }}
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

export default Units;