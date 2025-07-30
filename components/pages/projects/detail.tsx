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

const  columns: ColumnDef<Unit>[] = [

]

const purpose: DropdownOption[] = [
  {label: "Commercial", value: 'commercial'},
  {label: "Residential", value: 'residential'},
  {label: "Mixed Use", value: 'mixed_use'},
  {label: "Industrial", value: 'industrial'},
  {label: "Others", value: 'others'},
].sort((a, b) => a.label.localeCompare(b.label))

const Project: React.FC = () => {
  const {project_id} = useLocalSearchParams<{project_id: string}>();
  const styles = useStyles();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back } = useRouter();
  const {project, isLoading} = useGetProjectQuery(project_id);

  return (
    <View style={styles.container}>
      <Breadcrumb />
      <View style={styles.formArea}>
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
      <Table<Unit> columns={[]} data={[]} filter={{ field: 'type', options: [], }} />
    </View>
  );
};

const useStyles = () => {
  const { fontPixel, widthPixel, heightPixel } = useResponsive();
  const { colors, shadow } = useTheme();
  const { m, large } = useRoundness()

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
    }
  });
};

export default Project;