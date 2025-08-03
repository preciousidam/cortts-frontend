import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { Breadcrumb } from '@/components/breadcrumb';
import { useGetProjectQuery } from '@/store/projects/queries';
import { Typography } from '@/components/typography';
import { ColoredPill, ColorIndicator } from '@/components/Pill';
import { capitalize } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { ColumnDef } from '@/components/Table/logic';
import { Unit } from '@/types/models';
import Table from '@/components/Table';
import { Image } from 'expo-image';
import generateAvatarImage from '@/utilities/generateAvatarImage';
import { Button } from '@/components/button';
import { BaseDropdown } from '@/components/input/dropdown/dropdown';
import { useTableStyles } from '@/components/Table/style';
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

const Project: React.FC = () => {
  const {project_id} = useLocalSearchParams<{project_id: string}>();
  const styles = useStyles();
  const { bodyText } = useTableStyles();
  const { widthPixel } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back, push } = useRouter();
  const {project, isLoading} = useGetProjectQuery(project_id);

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
        return <ColoredPill title={capitalize(props.cell.getValue() as string ?? 'Not Started')} color={!props.cell.getValue() || (props.cell.getValue() as string) == 'not_started' ? 'yellow'  : (props.cell.getValue() as string) == 'completed' ? 'green' : 'blue'} />;
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
      header: 'Payment Status',
      accessorKey: 'payment_status',
      meta: { width: widthPixel(142) }
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
    <View style={styles.container}>
      <View style={styles.row}>
        <Breadcrumb />
        <BaseDropdown
          options={[
            { label: 'Edit Project', value: 'edit' },
            { label: 'Delete', value: 'delete' }
          ]}
          isSearchable={false}
          onSelect={onSelect}
          anchor={props => <Button
            onPress={props.onPress}
            ref={props.ref}
            size='medium'
            iconOnly
            icon="Ionicons.ellipsis-vertical"
            variant='secondary'
          />}
        />
      </View>
      <View style={styles.formArea}>
        <View style={styles.row}>
          <Image
            placeholder={generateAvatarImage({ name: project?.name ?? '', size: widthPixel(88) })}
            style={styles.image}
            source={{ uri: project?.artwork_url ?? '' }}
          />
          <View style={styles.header}>
            <View style={styles.ctaView}>
              <Typography size="subtitle" variant='bold' >{project?.name}</Typography>
              <ColoredPill title={project?.status ?? ''} color={project?.status ==  'completed' ? 'green' : project?.status == 'archived' ? 'gray' : 'yellow'} />
            </View>
            <Typography color={colors.textWeak}>{project?.description}</Typography>
            <View style={styles.smallGap}>
              <Typography color={colors.primary}>{capitalize(project?.purpose)}</Typography>
              <ColorIndicator color='gray' />
              <Typography color={colors.textWeak}><Ionicons name="location-outline" color={colors.warning} size={fontPixel(14)} /> {project?.address}</Typography>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.card}>
            <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Total Revenue Generated</Typography>
            <Typography  variant='semiBold' size='subtitle' style={styles.cardValue}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(project?.total_revenue ?? 0)}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Total Units</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.num_units ?? 0}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Sold Units</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.sold_units ?? 0}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Assigned Agents</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>1</Typography>
          </View>
        </View>
      </View>
      <Table<Unit>
        columns={columns}
        data={project?.units ?? []}
        filter={{ field: 'type', options: purpose }}
        loading={isLoading}
        onRowSelected={unit => push(`/(app)/(admin)/Units/${unit.id}`)}
      />
    </View>
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
    image: {
      width: widthPixel(88),
      height: widthPixel(88),
      ...circle
    }
  });
};

export default Project;