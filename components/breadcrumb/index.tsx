

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSegments, useRouter, ExternalPathString, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Button } from '../button';
import { useGetProjectQuery } from '@/store/projects/queries';
import { useGetUnitQuery } from '@/store/units/queries';

const removeGroupsFromPath = (paths: string[]) => {
  return paths.filter(segment => !segment.startsWith('(') && !segment.endsWith(')'));
};

export const Breadcrumb: React.FC = () => {
  const styles = useStyles();
  const segments = useSegments();
  const { replace, back } = useRouter();
  const {colors} = useTheme();
  const { isMobile } = useResponsive();
  const { project_id, unit_id } = useLocalSearchParams();
  const { project } = useGetProjectQuery(project_id as string, !!project_id);
  const { unit } = useGetUnitQuery(unit_id as string, !!unit_id);

  const paths = removeGroupsFromPath(segments.filter(Boolean));
  const handlePress = (index: number) => {
    const newPath = '/' + paths.slice(0, index + 1).join('/');
    replace(newPath as ExternalPathString);
  };

  if (isMobile || paths.length <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.goBack}>
        <Button iconOnly icon="Ionicons.arrow-back" size='small' variant='secondary' onPress={back} />
        <Typography variant='medium' style={{color: colors.text.weak}} onPress={back}>
          Go Back
        </Typography>
      </View>
      {paths.map((segment, index) => (
        <View style={styles.item} key={index}>
          <Pressable onPress={() => handlePress(index)}>
            <Typography variant='medium' style={[styles.text, index === paths.length - 1 ? { color: colors.brand.blue } : {}]}>
              {segment.replace(/-/g, ' ').replace('[project_id]', project?.name || 'Project').replace('[unit_id]', unit?.name || 'Unit')}
            </Typography>
          </Pressable>
          {index < paths.length - 1 && <Typography style={styles.separator}>/</Typography>}
        </View>
      ))}
    </View>
  );
};

const useStyles = () => {
  const { widthPixel } = useResponsive();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: widthPixel(4),
      marginBottom: widthPixel(12),
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      textTransform: 'capitalize',
      fontWeight: '500',
    },
    separator: {
      marginHorizontal: widthPixel(4),
      color: '#999',
    },
    goBack: {
      flexDirection: 'row',
      columnGap: widthPixel(12),
      paddingRight: widthPixel(12),
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  });
}