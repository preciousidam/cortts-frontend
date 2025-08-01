import { ListHeader } from '@/components/listHeader';
import { ColoredPill } from '@/components/Pill';
import Table from '@/components/Table';
import { useTableStyles } from '@/components/Table/style';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetProjectsQueries } from '@/store/projects/queries';
import { Project } from '@/types/models';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { capitalize } from 'lodash';
import React from 'react';
import { View, StyleSheet } from 'react-native';


const Projects: React.FC = () => {
  const styles = useStyles();
  const tableStyles = useTableStyles();
  const { projects, count, isLoading } = useGetProjectsQueries();
  const { widthPixel } = useResponsive();
  const { push } = useRouter();
  const columns: ColumnDef<Project>[] =  [
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
        return <Typography style={tableStyles.bodyText}>{format(new Date(props.cell.getValue() as string), 'MMMM dd, yyyy')}</Typography>;
      },
    },
  ];

  const createNewProject = () => {
    push('./new', { relativeToDirectory: true });
  };

  return (
    <View style={styles.container}>
      <ListHeader
        title="Projects"
        description="Residential housing developments containing multiple units."
        primaryAction={{ title: 'Create New Project', onPress: createNewProject }}
        secondaryAction={{ title: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }}
      />
      <Table<Project>
        columns={columns}
        data={projects}
        filter={{ field: 'purpose', options: [{ label: 'Residential', value: 'residential' }, { label: 'Commercial', value: 'commercial' }], multiple: false }}
        onRowSelected={(row) => push(`./${row.id}`, { relativeToDirectory: true })}
        loading={isLoading}
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