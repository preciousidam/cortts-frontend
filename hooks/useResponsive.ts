
import { getBreakpoint, isGte, isLt } from '@/styleguide/breakpoints';
import { useMemo } from 'react';
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
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// choose a max “design” width you want scaling to stop at
const MAX_SCALE_WIDTH = 1440;  // or 1600
const MAX_SCALE_HEIGHT = 1024; // or 900/1080

const effectiveWidth = clamp(width, baseScreen.WIDTH, MAX_SCALE_WIDTH);
const effectiveHeight = clamp(height, baseScreen.HEIGHT, MAX_SCALE_HEIGHT);


  // Base scales
  const widthBaseScale = effectiveWidth / baseScreen.WIDTH;
  const heightBaseScale = effectiveHeight / baseScreen.HEIGHT;
  const widthBaseScaleTablet = effectiveWidth / baseScreenTab.WIDTH;
  const heightBaseScaleTablet = effectiveHeight / baseScreenTab.HEIGHT;

  // Optional: increase scale slightly on md+ screens
  const scaleUpFactor = isGte(breakpoint, 'md') ? 0.5 : 1;

  const calcDevicePx = (px: number, base: BASE = BASE.WIDTH): number => {
    let scale =
      base === BASE.HEIGHT
        ? isGte(breakpoint, 'md')
          ? heightBaseScaleTablet
          : heightBaseScale
        : isGte(breakpoint, 'md')
        ? widthBaseScaleTablet
        : widthBaseScale;

    const newSize = px * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const widthPixel = (size: number) => calcDevicePx(size, BASE.WIDTH);
  const heightPixel = (size: number) =>
    width <= height ? calcDevicePx(size, BASE.WIDTH) : calcDevicePx(size, BASE.HEIGHT);
  const fontPixel = (size: number) => widthPixel(size);
  const lineHeight = (size: number) => heightPixel(size);

  return useMemo(() => ({
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
  }), [width, height, breakpoint]);
};
