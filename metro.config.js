// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const nativeWindConfig = withNativeWind(config, { input: './global.css' });
const enableStorybook =
  process.env.EXPO_PUBLIC_STORYBOOK === 'true' ||
  process.env.STORYBOOK === 'true';

if (!enableStorybook) {
  module.exports = nativeWindConfig;
} else {
  const withStorybook = require('@storybook/react-native/metro/withStorybook');

  module.exports = withStorybook(nativeWindConfig, {
    enable: true,
    configPath: path.resolve(__dirname, './.rnstorybook'),
  });
}
