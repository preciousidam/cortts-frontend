import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/typography';

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK === 'true';

export default function StorybookRoute() {
  if (!storybookEnabled) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-6">
        <Typography variant="serifBold" size="headlineSm">
          Storybook is disabled
        </Typography>
        <Typography
          className="mt-3 text-center text-text-weak"
          size="bodyMd"
        >
          Set `EXPO_PUBLIC_STORYBOOK=true` before starting Expo to load the Storybook UI.
        </Typography>
      </View>
    );
  }

  // Keep the Storybook dependency out of the default native/web bundle unless explicitly enabled.
  // Metro eagerly follows static require/import paths, so use a non-static require here.
  // eslint-disable-next-line no-eval
  const runtimeRequire = eval('require') as NodeRequire;
  const StorybookUIRoot = runtimeRequire('../.rnstorybook').default;
  return <StorybookUIRoot />;
}
