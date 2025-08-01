import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
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

const  columns: ColumnDef<Unit>[] = [

]

const purpose: DropdownOption<string>[] = [
  {label: "Commercial", value: 'commercial'},
  {label: "Residential", value: 'residential'},
  {label: "Mixed Use", value: 'mixed_use'},
  {label: "Industrial", value: 'industrial'},
  {label: "Others", value: 'others'},
].sort((a, b) => a.label.localeCompare(b.label))

const Project: React.FC = () => {
  const {project_id} = useLocalSearchParams<{project_id: string}>();
  const styles = useStyles();
  const { widthPixel, heightPixel } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back } = useRouter();
  const {project, isLoading} = useGetProjectQuery(project_id);

  return (
    <View style={styles.container}>
      <Breadcrumb />
      <View style={styles.formArea}>
        <View style={styles.row}>
          <Image placeholder={generateAvatarImage({name: project?.name ?? '', size: widthPixel(88) })} style={styles.image} />
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
            <Typography variant='regular' color={generateColorScale(colors.neutral).normalHover}>Total Revenue Generated</Typography>
            <Typography  variant='semiBold' size='subtitle' style={styles.cardValue}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(project?.total_revenue ?? 0)}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' color={generateColorScale(colors.neutral).normalHover}>Total Units</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.num_units ?? 0}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' color={generateColorScale(colors.neutral).normalHover}>Sold Units</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>{project?.sold_units ?? 0}</Typography>
          </View>
          <View style={styles.card}>
            <Typography variant='regular' color={generateColorScale(colors.neutral).normalHover}>Assigned Agents</Typography>
            <Typography variant='semiBold' size='subtitle' style={styles.cardValue}>1</Typography>
          </View>
        </View>
      </View>
      <Table<Unit> columns={columns} data={project?.units ?? []} filter={{ field: 'type', options: purpose }} loading={isLoading} />
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
      rowGap: heightPixel(24),
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