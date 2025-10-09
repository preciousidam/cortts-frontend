import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
import { useTableStyles } from '@/components/Table/style';
import { format } from 'date-fns';
import PopupMenuV1 from '@/components/PopupMenu';
import { MobileRow } from '../units/list';
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

const Project: React.FC = () => {
  const {project_id} = useLocalSearchParams<{project_id: string}>();
  const styles = useStyles();
  const { bodyText } = useTableStyles();
  const { widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel, isMobile} = useResponsive();
  const { back, push } = useRouter();
  const {project, isLoading} = useGetProjectQuery(project_id);
  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({
      headerShown: isMobile,
      title: isMobile ? project?.name : '',
      headerRight: () => <PopupMenuV1
      inHeader
      anchor={props => <Button iconOnly icon="Ionicons.ellipsis-vertical" {...props} variant='tertiary' size='medium' />}
        options={[
          { label: 'Edit Project', onPress: () => onSelect('edit') },
          { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
        ]}
      />
    });
  }, [isMobile, project]);

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

  if (!project && !isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Typography variant='bold' size='subtitle'>Project not found</Typography>
        <Button style={{ marginTop: heightPixel(16) }} onPress={() => back()} title="Go Back" />
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {!isMobile && <View style={styles.row}>
          <Breadcrumb />
          <PopupMenuV1
            options={[
              { label: 'Edit Project', onPress: () => onSelect('edit') },
              { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
            ]}
          />
        </View>}
        <View style={[styles.formArea, isMobile && { flexDirection: 'column', rowGap: heightPixel(16), paddingHorizontal: widthPixel(16) }]}>
          {!isMobile && <View style={[styles.row, isMobile && {  alignItems: 'flex-start' }]}>
            <Image
              placeholder={generateAvatarImage({ name: project?.name ?? '', size: widthPixel(isMobile ? 32 : 88) })}
              style={[styles.image, isMobile && styles.mobileImage]}
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
          </View>}
          {isMobile && <View style={[styles.card, isMobile && { flex: 1, width: '100%', rowGap: heightPixel(12) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: widthPixel(12) }}>
              <Image
                placeholder={generateAvatarImage({ name: project?.name ?? '', size: widthPixel(isMobile ? 32 : 88) })}
                style={[styles.image, isMobile && styles.mobileImage]}
                source={{ uri: project?.artwork_url ?? '' }}
              />
              <Typography size="subtitle" variant='bold' >{project?.name}</Typography>
            </View>
            <Typography color={colors.textWeak}>{project?.description}</Typography>
            <View style={styles.smallGap}>
              <Typography color={colors.primary}>{capitalize(project?.purpose)}</Typography>
              <ColorIndicator color='gray' />
              <Typography color={colors.textWeak}><Ionicons name="location-outline" color={colors.warning} size={fontPixel(14)} /> {project?.address}</Typography>
            </View>
            <ColoredPill title={project?.status ?? ''} color={project?.status ==  'completed' ? 'green' : project?.status == 'archived' ? 'gray' : 'yellow'} style={{ alignSelf: 'flex-start' }} />
          </View>}
          <View style={[styles.row, isMobile && { flexWrap: 'wrap', flexDirection: 'column', rowGap: heightPixel(16) }]}>
            <View style={[styles.card, isMobile && { flex: 1, width: '100%' }]}>
              <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Total Revenue Generated</Typography>
              <Typography  variant='semiBold' size='subtitle' style={styles.cardValue}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(project?.total_revenue ?? 0)}</Typography>
            </View>
            <View style={[styles.card, isMobile && { flex: 1, width: '100%' }]}>
              <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Total Units</Typography>
              <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.num_units ?? 0}</Typography>
            </View>
            <View style={[styles.card, isMobile && { flex: 1, width: '100%' }]}>
              <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Sold Units</Typography>
              <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.sold_units ?? 0}</Typography>
            </View>
            <View style={[styles.card, isMobile && { flex: 1, width: '100%' }]}>
              <Typography variant='regular' size='caption' color={generateColorScale(colors.neutral).normalHover}>Assigned Agents</Typography>
              <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>1</Typography>
            </View>
          </View>
        </View>
        <View style={styles.tableView}>
          <Table<Unit>
            columns={columns}
            data={project?.units ?? []}
            filter={{ field: 'type', options: purpose }}
            loading={isLoading}
            onRowSelected={unit => push(`./Units/${unit.id}`, { relativeToDirectory: true })}
            renderRow={isMobile ? (row => <MobileRow row={row} onPress={() => push(`./Units/${row.id}`, { relativeToDirectory: true })} />): undefined}
            tableContainerStyle={isMobile ? { borderColor: 'transparent', backgroundColor: 'transparent'} : undefined}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const useStyles = () => {
  const { fontPixel, widthPixel, heightPixel, isMobile } = useResponsive();
  const { colors, shadow } = useTheme();
  const { m, large, circle } = useRoundness();

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(isMobile ? 0 : 32),
      paddingVertical: heightPixel(isMobile ? 0 : 32),
      rowGap: heightPixel(40),
    },
    formArea: {
      rowGap: heightPixel(24),
      backgroundColor: isMobile ? 'transparent' : colors.card,
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(24),
      ...large,
      borderColor: isMobile ? 'transparent' : generateColorScale(colors.neutral).lightHover,
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
      alignItems: 'center',
      flexWrap: 'wrap'
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
    },
    mobileImage: {
      width: widthPixel(32),
      height: widthPixel(32),
      ...circle
    },
    tableView: {
      paddingHorizontal: widthPixel(isMobile ? 16 : 0)
    }
  });
};

export default Project;