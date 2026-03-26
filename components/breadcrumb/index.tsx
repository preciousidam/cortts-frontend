

import React from 'react';
import { View, Pressable } from 'react-native';
import { useSegments, useRouter, ExternalPathString, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '../button';
import { useGetProjectQuery } from '@/store/projects/queries';
import { useGetUnitQuery } from '@/store/units/queries';

const removeGroupsFromPath = (paths: string[]) => {
  return paths.filter(segment => !segment.startsWith('(') && !segment.endsWith(')'));
};

export const Breadcrumb: React.FC = () => {
  const segments = useSegments();
  const { replace, back } = useRouter();
  const { isMobile, widthPixel } = useResponsive();
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
    <View className="flex-row flex-wrap items-center" style={{ gap: widthPixel(4), marginBottom: widthPixel(12) }}>
      <View className="flex-row items-center justify-start" style={{ columnGap: widthPixel(12), paddingRight: widthPixel(12) }}>
        <Button iconOnly icon="Ionicons.arrow-back" size='small' variant='secondary' onPress={back} />
        <Typography variant='medium' className="text-text-weak dark:text-dark-textWeak" onPress={back}>
          Go Back
        </Typography>
      </View>
      {paths.map((segment, index) => (
        <View className="flex-row items-center" key={index}>
          <Pressable onPress={() => handlePress(index)}>
            <Typography
              variant='medium'
              className={`capitalize ${index === paths.length - 1 ? 'text-brand-blue' : 'text-text-default dark:text-dark-text'}`}
            >
              {segment.replace(/-/g, ' ').replace('[project_id]', project?.name || 'Project').replace('[unit_id]', unit?.name || 'Unit')}
            </Typography>
          </Pressable>
          {index < paths.length - 1 && (
            <Typography className="text-neutral-normalHover" style={{ marginHorizontal: widthPixel(4) }}>/</Typography>
          )}
        </View>
      ))}
    </View>
  );
};