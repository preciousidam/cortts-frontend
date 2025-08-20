import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bar } from 'react-native-progress';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { Breadcrumb } from '@/components/breadcrumb';
import { Typography } from '@/components/typography';
import { ColoredPill, ColorIndicator } from '@/components/Pill';
import { capitalize } from 'lodash';
import { ColumnDef } from '@/components/Table/logic';
import { Payment, PaymentDuration, Unit } from '@/types/models';
import { useTableStyles } from '@/components/Table/style';
import { useGetUnitPaymentsQuery, useGetUnitQuery } from '@/store/units/queries';
import { CustomTab } from '@/components/tab';
import { Route } from 'react-native-tab-view';
import PopupMenuV1 from '@/components/PopupMenu';
import { Ionicons } from '@expo/vector-icons';
import { useGetProjectQuery } from '@/store/projects/queries';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Image } from 'expo-image';
import Table from '@/components/Table';
import { format } from 'date-fns';

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

const UnitDetail: React.FC = () => {
  const {unit_id} = useLocalSearchParams<{unit_id: string}>();
  const styles = useStyles();
  const { bodyText } = useTableStyles();
  const { widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back, push } = useRouter();
  const {unit, isLoading} = useGetUnitQuery(unit_id);
  const { project} = useGetProjectQuery(unit?.project_id ?? '');
  const { payments, isLoading: isLoadingPayments } = useGetUnitPaymentsQuery(unit_id);

  const onViewPaymentReceipt = useCallback((paymentId: string) => {
    push(`./payments/${paymentId}/receipt`, { relativeToDirectory: true });
  }, [push]);

  const columns: ColumnDef<Payment>[] =  useMemo(() => [
    {
      header: 'Status',
      accessorKey: 'status',
      meta: { width: widthPixel(142) },
      cell: props => <ColoredPill title={capitalize(props.cell.getValue() as string).replace(/_/g, ' ')} color={(props.cell.getValue() as string) == 'paid' ? 'green' : (props.cell.getValue() as string) == 'not_paid' ? 'yellow' : 'red'} />
    },
    {
      header: 'Reason for Payment',
      accessorKey: 'reason_for_payment',
      meta: { width: widthPixel(291) },
      cell: props => <Typography style={bodyText}>{props.cell.getValue() ? capitalize(props.cell.getValue() as string) : 'N/A'}</Typography>
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      meta: { width: widthPixel(213) },
      cell: (props) => {
        return <Typography style={bodyText}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(props.cell.getValue() as number)}</Typography>;
      }
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      meta: { width: widthPixel(200) },
      cell: (props) => {
        return <Typography style={bodyText}>{props.cell.getValue() ? format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy') : 'N/A'}</Typography>;
      }
    },
    {
      header: 'Payment Date',
      accessorKey: 'payment_date',
      meta: { width: widthPixel(147) },
      cell: (props) => {
        return <Typography style={bodyText}>{props.cell.getValue() ? format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy') : 'N/A'}</Typography>;
      }
    },
    {
      header: 'Actions',
      meta: { width: widthPixel(119) },
      cell: (props) => {
        return (
          <PopupMenuV1
            options={[
              { label: 'View Receipt', onPress: () => onViewPaymentReceipt(props.row.original?.id), disabled: true },
              { label: 'Delete Payment', onPress: () => {}, destructive: true, disabled: true }
            ]}
          />
        );
      }
    }
  ], [widthPixel])

  const onSelect = (option: 'edit' | 'delete') => {
    if (option == 'edit') {
      push('./edit', { relativeToDirectory: true })
    }
  }

  const renderScene = useCallback(({ route }: { route: Route }) => {
    switch (route.key) {
      case 'payments':
        return (
          <Table<Payment>
            columns={columns}
            data={payments}
            filter={{ field: 'reason_for_payment', options: purpose, multiple: false }}
            onRowSelected={(row) => push(`./payments/${row.id}`, { relativeToDirectory: true })}
            loading={isLoadingPayments}
            emptyStateText="No payment history available for this unit."
            loadingComponent={<Typography>Loading payment history...</Typography>}
            style={{ paddingVertical: heightPixel(32) }}
            rowCount={5}
          />
        );
      case 'documents':
        return <></>;
      default:
        return null;
    }
  }, [isLoading, push, columns, heightPixel]);

  const duration = (d: Unit['payment_duration']) => {
    switch (d) {
      case 'monthly':
        return 'month';
      case 'quarterly':
        return 'quarter';
      case 'bi_annually':
        return '6 months';
      case 'annually':
        return 'year';
      default:
        return '';
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <Breadcrumb />
          <PopupMenuV1
            options={[
              { label: 'Edit unit', onPress: () => onSelect('edit') },
              { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
            ]}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', columnGap: widthPixel(24) }}>
          <View style={{ width: widthPixel(551), rowGap: heightPixel(16) }}>
            {/* details */}
            <View style={[styles.formArea, styles.row, {alignItems: 'flex-start'}]}>
              <View style={{ rowGap: heightPixel(12) }}>
                <Typography variant='bold' size='subtitle'>{unit?.name}</Typography>
                <View style={styles.smallGap}>
                  <Typography color={colors.textWeak}>{capitalize(unit?.type)}</Typography>
                  <ColorIndicator color='gray' />
                  <Typography color={colors.textWeak}><Ionicons name="location-outline" color={colors.warning} size={fontPixel(14)} /> {project?.address}</Typography>
                </View>
              </View>
              <View>
                <ColoredPill title={capitalize(unit?.development_status?.split('_').join(' '))} color={unit?.development_status === 'completed' ? 'green' : unit?.development_status === 'in_progress' ? 'blue' : 'gray'} />
                {unit?.warranty?.isValid && <Typography>{(unit?.warranty_period ?? 0) / 12} years</Typography>}
              </View>
            </View>
            <View style={[styles.formArea, ]}>
              <View style={styles.row}>
                <View style={styles.gapBetween}>
                  <Typography size='caption' color={colors.neutral}>Assigned Client</Typography>
                  <Typography variant='semiBold'>{unit?.client ? unit?.client?.fullname : "No assigned client"}</Typography>
                </View>
                <Button onPress={() => {}} variant='outlined' size='large' rightIcon="Ionicons.add-outline">Assign Client</Button>
              </View>
              <Divider />
              <View style={{ rowGap: heightPixel(8) }}>
                {unit?.unit_agents?.length == 0 && <View style={styles.row}>
                  <View style={styles.gapBetween}>
                    <Typography size='caption' color={colors.neutral}>Assigned Agent</Typography>
                    <Typography variant='semiBold'>No assigned agent</Typography>
                  </View>
                  <Button onPress={() => {}} variant='outlined' size='large' rightIcon="Ionicons.add-outline">Assign Agent</Button>
                </View>}
                {(unit?.unit_agents?.length ?? 0) > 1 && <Button title="See All Agents" variant='tertiary' size='small' />}
              </View>
            </View>
            <View style={[styles.formArea, {paddingBottom: heightPixel(56)}]}>
              <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'flex-start'}]}>
                <View style={styles.gapBetween}>
                  <Typography size='caption' color={colors.neutral}>Unit Price</Typography>
                  <View style={styles.amountDiscount}>
                    <Typography variant='semiBold' size='subtitle' style={styles.amount}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.total ?? 0)}</Typography>
                    <ColoredPill showIndicator={false} title={`-${unit?.discount}%`} color='blue' />
                  </View>
                  <Typography size='caption' color={colors.neutral} style={{ textDecorationLine: 'line-through' }}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.amount ?? 0)}</Typography>
                </View>
                <View style={[styles.alignLeft, styles.gapBetween]}>
                  <Typography size='caption' color={colors.neutral}>Outstanding Balance</Typography>
                  <Typography variant='regular' size='body' color={colors.notification} style={styles.outstanding}>-{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.outstanding ?? 0)}</Typography>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.gapBetween}>
                  <Typography size='caption' color={colors.neutral}>Installment Amount</Typography>
                  <Typography variant='medium' size='body'>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.installment_amount ?? 0)} / {duration(unit?.payment_duration  ?? PaymentDuration.MONTHLY)} x {unit?.installment ?? 0}</Typography>
                </View>
                <View style={[styles.alignLeft, styles.gapBetween]}>
                  <Typography size='caption' color={colors.neutral}>Total Paid</Typography>
                  <Typography variant='medium' size='body'>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.total_deposit ?? 0)}</Typography>
                </View>
              </View>
              <Divider />
              <View style={{ rowGap: heightPixel(12) }}>
                <View style={styles.row}>
                  <Typography color={colors.neutral}>Payment Progress</Typography>
                  <Typography color={colors.neutral}>{unit?.payment_summary?.percentage_paid}% completed</Typography>
                </View>
                <Bar progress={(unit?.payment_summary?.percentage_paid ?? 0) / 100} width={widthPixel(500)} color={colors.primary} borderWidth={0} unfilledColor='#F4F4F4' />
              </View>
            </View>
          </View>
          <View style={{ rowGap: heightPixel(12)}}>
            {/* image */}
            <Image source={{ uri: unit?.images?.[0] }} style={styles.largeImage} contentFit='cover' placeholderContentFit='cover' placeholder="https://placehold.co/529x437.85" />
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', columnGap: widthPixel(8) }}>
                {unit?.images?.slice(1, 5).map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.image} contentFit='cover' placeholderContentFit='cover' placeholder="https://placehold.co/126.25x105" />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <CustomTab
          initialIndex={0}
          routes={[
            { key: 'payments', title: 'Payment History' },
            { key: 'documents', title: 'Documents' }
          ]}
          renderScene={renderScene}
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
      rowGap: heightPixel(24),
    },
    formArea: {
      rowGap: heightPixel(32),
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(24),
      ...large,
      borderColor: generateColorScale(colors.neutral).lightHover,
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
      color: colors.primary
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
      borderColor: generateColorScale(colors.neutral).lightActive,
      ...shadow(heightPixel(1), m.borderRadius),
      rowGap: heightPixel(4),
      flex: 1,
    },
    cardValue: {
      fontSize: fontPixel(20),
      color: colors.text,
    },
    largeImage: {
      width: widthPixel(529),
      height: widthPixel(437.85),
      ...m
    },
    image: {
      width: widthPixel(126.25),
      height: widthPixel(105),
      ...m
    },
    amount: {
      fontSize: fontPixel(20),
    },
    outstanding: {
      fontSize: fontPixel(16),
    },
    alignLeft: {
      alignItems: 'flex-end',
    },
    gapBetween: {
      rowGap: heightPixel(8),
    },
    amountDiscount: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: widthPixel(8),
    }
  });
};

export default UnitDetail;