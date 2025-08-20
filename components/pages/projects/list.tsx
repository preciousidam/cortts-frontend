import { ListHeader } from '@/components/listHeader';
import { ColoredPill } from '@/components/Pill';
import { CustomTab } from '@/components/tab';
import Table from '@/components/Table';
import { useTableStyles } from '@/components/Table/style';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetProjectsQueries } from '@/store/projects/queries';
import { Project } from '@/types/models';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { capitalize } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';


const Projects: React.FC = () => {
  const styles = useStyles();
  const tableStyles = useTableStyles();
  const { projects, count, isLoading } = useGetProjectsQueries();
  const { widthPixel, heightPixel } = useResponsive();
  const { push, setParams } = useRouter();
  const { tab } = useLocalSearchParams<{tab: 'all' | 'ongoing' | 'completed' | 'archived'}>()
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
      <View style={{ paddingVertical: heightPixel(32)}}>
        <Table<Project>
          columns={columns}
          data={projects}
          filter={{ field: 'purpose', options: [{ label: 'Residential', value: 'residential' }, { label: 'Commercial', value: 'commercial' }], multiple: false }}
          onRowSelected={(row) => push(`./${row.id}`, { relativeToDirectory: true })}
          loading={isLoading}
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
    <View style={styles.container}>
      <ListHeader
        title="Projects"
        description="Residential housing developments containing multiple units."
        primaryAction={{ title: 'Create New Project', onPress: createNewProject }}
        secondaryAction={{ title: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }}
      />
      <CustomTab
        initialIndex={getInitialTabIndex()}
        routes={[{ key: 'all', title: 'All' }, { key: 'ongoing', title: 'Ongoing' }, { key: 'completed', title: 'Completed' }, { key: 'archived', title: 'Archived' }]}
        renderScene={renderPage}
        onIndexChange={onIndexChange}
      />
    </View>
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

export default Projects;