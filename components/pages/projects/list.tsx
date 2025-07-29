import { ListHeader } from '@/components/listHeader';
import Table, { useTableStyles } from '@/components/Table/index.web';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useProjectQueries } from '@/store/projects/queries';
import { Project } from '@/types/models';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import React from 'react';
import { View, StyleSheet } from 'react-native';


const Projects: React.FC = () => {
  const styles = useStyles();
  const tableStyles = useTableStyles();
  const { projects, count } = useProjectQueries();
  const { widthPixel } = useResponsive();
  const columns: ColumnDef<Project, string>[] =  [
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
      meta: { width: widthPixel(120) },
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
        return <Typography style={tableStyles.bodyText}>{props.cell.getValue()}</Typography>;
      },
    },
    {
      header: 'Date Added',
      accessorKey: 'created_at',
      meta: { width: widthPixel(150) },
      cell(props) {
        return <Typography style={tableStyles.bodyText}>{format(new Date(props.cell.getValue()), 'MMMM dd, yyyy')}</Typography>;
      },
    },
  ]

  return (
    <View style={styles.container}>
      <ListHeader
        title="Projects"
        description="Residential housing developments containing multiple units."
        primaryAction={{ title: 'Create New Project', onPress: () => console.log('Create Project Pressed') }}
        secondaryAction={{ title: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }}
      />
      <Table columns={columns} data={projects} filter={{ field: 'purpose', options: [{ label: 'Residential', value: 'residential' }, { label: 'Commercial', value: 'commercial' }], multiple: false }} />
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