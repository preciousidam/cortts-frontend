

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSegments, useRouter, ExternalPathString } from 'expo-router';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { Button } from '../button';

const removeGroupsFromPath = (paths: string[]) => {
  return paths.filter(segment => !segment.startsWith('(') && !segment.endsWith(')'));
};

export const Breadcrumb: React.FC = () => {
  const styles = useStyles();
  const segments = useSegments();
  const { replace, back } = useRouter();
  const {colors} = useTheme();

  const paths = removeGroupsFromPath(segments.filter(Boolean));
  const handlePress = (index: number) => {
    const newPath = '/' + paths.slice(0, index + 1).join('/');
    replace(newPath as ExternalPathString);
  };


  return (
    <View style={styles.container}>
      <View style={styles.goBack}>
        <Button iconOnly icon="Ionicons.arrow-back" size='small' variant='secondary' onPress={back} />
        <Typography variant='medium' style={{color: colors.textWeak}} onPress={back}>
          Go Back
        </Typography>
      </View>
      {paths.map((segment, index) => (
        <View style={styles.item} key={index}>
          <Pressable onPress={() => handlePress(index)}>
            <Typography variant='medium' style={[styles.text, index === paths.length - 1 ? { color: colors.primary } : {}]}>
              {segment.replace(/-/g, ' ')}
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