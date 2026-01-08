import { ListHeader } from '@/components/listHeader';
import { ColoredPill } from '@/components/Pill';
import PopupMenuV1 from '@/components/PopupMenu';
import { CustomTab } from '@/components/tab';
import Table from '@/components/Table';
import { useTableStyles } from '@/components/Table/style';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetProjectsQueries } from '@/store/projects/queries';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Project } from '@/types/models';
import { ColumnDef } from '@/components/Table/logic';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import { PageContent } from '../pageContent';


const Projects: React.FC = () => {
  const styles = useStyles();
  const tableStyles = useTableStyles();
  const { projects, count, isLoading } = useGetProjectsQueries();
  const { widthPixel, heightPixel, isMobile } = useResponsive();
  const { push, setParams } = useRouter();
  const { tab } = useLocalSearchParams<{tab: 'all' | 'ongoing' | 'completed' | 'archived'}>();
  const { setOptions } = useNavigation();
  useEffect(() => {
    setOptions({
      headerShown: isMobile,
      title: isMobile ? 'Projects' : '',
      headerRight: () => <View>
        <PopupMenuV1
          inHeader
          headerOffset={56}
          anchorVariant='tertiary'
          placement='bottom-end'
          options={[
            { label: 'Create New Project', onPress: createNewProject },
            { label: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }
          ]}
        />
      </View>
    });
  }, [isMobile]);

  const columns: ColumnDef<Project>[] =  useMemo(() => [
    {
      header: 'Project Name',
      accessorKey: 'name',
      meta: { width: widthPixel(149) },
    },
    {
      header: 'Address',
      accessorKey: 'address',
      meta: { width: widthPixel(198) },
    },
    {
      header: 'Description',
      accessorKey: 'description',
      meta: { width: widthPixel(258) },
    },
    {
      header: 'Purpose',
      accessorKey: 'purpose',
      meta: { width: widthPixel(125) },
      cell(props) {
        return <Typography style={tableStyles.bodyText}>{capitalize(props.cell.getValue() as string)}</Typography>;
      },
    },
    {
      header: 'Total Units',
      accessorKey: 'num_units',
      meta: { width: widthPixel(120) },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      meta: { width: widthPixel(133) },
      cell(props) {
        return <ColoredPill title={capitalize(props.cell.getValue() as string)} color={(props.cell.getValue() as string) == 'ongoing' ? 'yellow'  : (props.cell.getValue() as string) == 'completed' ? 'green' : 'gray'} />;
      },
    },
    {
      header: 'Date Added',
      accessorKey: 'created_at',
      meta: { width: widthPixel(150) },
      cell(props) {
        return <Typography style={tableStyles.bodyText}>{format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy')}</Typography>;
      },
    },
  ], [widthPixel, tableStyles.bodyText]);

  const createNewProject = () => {
    push('./new', { relativeToDirectory: true });
  };

  const renderPage = useCallback((props: SceneRendererProps & { route: Route}) => {
    return (
      <View style={{ paddingTop: heightPixel(isMobile ? 16 : 32)}}>
        <Table<Project>
          columns={columns}
          data={projects}
          filter={{ field: 'purpose', options: [{ label: 'Residential', value: 'residential' }, { label: 'Commercial', value: 'commercial' }], multiple: false }}
          onRowSelected={(row) => push(`./${row.id}`, { relativeToDirectory: true })}
          loading={isLoading}
          renderRow={isMobile ? (row) => <MobileRow row={row} onPress={() => push(`./${row.id}`, { relativeToDirectory: true })} /> : undefined}
          tableContainerStyle={isMobile ? { borderColor: 'transparent', backgroundColor: 'transparent'} : undefined}
        />
      </View>
    )
  }, [columns, projects, push, isLoading]);

  const onIndexChange = (index: number) => {
    const tabKey = ['all', 'ongoing', 'completed', 'archived'][index];
    setParams({ tab: tabKey });
  }

  const getInitialTabIndex = () => {
    switch (tab) {
      case 'all':
        return 0;
      case 'ongoing':
        return 1;
      case 'completed':
        return 2;
      case 'archived':
        return 3;
      default:
        return 0;
    }
  }

  return (
    <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ flex: 1 }}>
      <PageContent>
        <View style={styles.container}>
          {!isMobile && <ListHeader
            title="Projects"
            description="Residential housing developments containing multiple units."
            primaryAction={{ title: 'Create New Project', onPress: createNewProject }}
            secondaryAction={{ title: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }}
          />}
          <CustomTab
            initialIndex={getInitialTabIndex()}
            routes={[{ key: 'all', title: 'All' }, { key: 'ongoing', title: 'Ongoing' }, { key: 'completed', title: 'Completed' }, { key: 'archived', title: 'Archived' }]}
            renderScene={renderPage}
            onIndexChange={onIndexChange}
          />
        </View>
      </PageContent>
    </ScrollView>
  );
};

const MobileRow: React.FC<{ row: Project; onPress: () => void }> = ({ row, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const placeHolder = "eUIW_,0gxURjobyGxBM|W.ae20$eNaWpn%WCX9xZf7oJOEoNt7s.ay"

  return (
    <Pressable onPress={onPress} style={styles.listCard}>
      <Image source={row.artwork_url} style={styles.image} placeholder={{blurhash: placeHolder}} />
      <View style={styles.view}>
        <Typography variant='bold'>{row.name}</Typography>
        <View style={styles.sb}>
          <Typography color={colors.text.weaker}>{capitalize(row.purpose)}</Typography>
          <Typography  color={colors.text.weaker}>&#x2022;</Typography>
          <ColoredPill title={capitalize(row.status)} color={row.status === 'ongoing' ? 'yellow' : row.status === 'completed' ? 'green' : 'gray'} />
        </View>
      </View>
    </Pressable>
  )
}

const useStyles = () => {
  const {isMobile, widthPixel, heightPixel} = useResponsive();
  const {m} = useRoundness();
  const {colors} = useTheme();

  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(isMobile ? 14 : 32),
      paddingVertical: heightPixel(isMobile ? 0 : 32),
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

export default Projects;