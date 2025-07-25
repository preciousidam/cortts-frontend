import { ListHeader } from '@/components/listHeader';
import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { View, StyleSheet } from 'react-native';


const Projects: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ListHeader
        title="Projects"
        description="Residential housing developments containing multiple units."
        primaryAction={{ title: 'Create New Project', onPress: () => console.log('Create Project Pressed') }}
        secondaryAction={{ title: 'Import Projects', onPress: () => console.log('Import Projects Pressed') }}
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
    },
  });
};

export default Projects;