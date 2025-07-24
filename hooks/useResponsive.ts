
import { getBreakpoint, isGte, isLt } from '@/styleguide/breakpoints';
import { PixelRatio, ScaledSize, useWindowDimensions } from 'react-native';

export enum BASE {
  HEIGHT = 'height',
  WIDTH = 'width',
}

export enum baseScreen {
  WIDTH = 414,
  HEIGHT = 966,
}

export enum baseScreenTab {
  WIDTH = 1440,
  HEIGHT = 1024,
}

/**
 * @returns Responsive utilities for handling different screen sizes and breakpoints.
 * Includes methods for calculating pixel values based on the current screen size.
 */

export const useResponsive = () => {
  const { width, height }: ScaledSize = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  const isPortrait = height >= width;
  const isLandscape = width > height;
  const isMobile = isLt(breakpoint, 'md');

  // Base scales
  const widthBaseScale = width / baseScreen.WIDTH;
  const heightBaseScale = height / baseScreen.HEIGHT;
  const widthBaseScaleTablet = width / baseScreenTab.WIDTH;
  const heightBaseScaleTablet = height / baseScreenTab.HEIGHT;

  // Optional: increase scale slightly on md+ screens
  const scaleUpFactor = isGte(breakpoint, 'xl')
    ? 1
    : isGte(breakpoint, 'lg')
    ? 1
    : isGte(breakpoint, 'md')
    ? 1
    : 1;

  const calcDevicePx = (px: number, base: BASE = BASE.WIDTH): number => {
    let scale =
      base === BASE.HEIGHT
        ? isGte(breakpoint, 'md')
          ? heightBaseScaleTablet
          : heightBaseScale
        : isGte(breakpoint, 'md')
        ? widthBaseScaleTablet
        : widthBaseScale;

    const newSize = px * scale * scaleUpFactor;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const widthPixel = (size: number) => calcDevicePx(size, BASE.WIDTH);
  const heightPixel = (size: number) =>
    width <= height ? calcDevicePx(size, BASE.WIDTH) : calcDevicePx(size, BASE.HEIGHT);
  const fontPixel = (size: number) => widthPixel(size);
  const lineHeight = (size: number) => heightPixel(size);

  return {
    width,
    height,
    isPortrait,
    isLandscape,
    breakpoint,
    widthBaseScale,
    heightBaseScale,
    widthPixel,
    heightPixel,
    fontPixel,
    lineHeight,
    scale: widthPixel,
    verticalScale: heightPixel,
    isMobile
  };
};