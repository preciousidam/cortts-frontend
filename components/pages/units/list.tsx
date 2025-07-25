import { ListHeader } from '@/components/listHeader';
import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { View, StyleSheet } from 'react-native';


const Units: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ListHeader
        title="Units"
        description="Residential and Commercial housing developments containing multiple units."
        primaryAction={{ title: 'Create New Unit', onPress: () => console.log('Create Unit Pressed') }}
        secondaryAction={{ title: 'Import Units', onPress: () => console.log('Import Units Pressed') }}
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

export default Units;