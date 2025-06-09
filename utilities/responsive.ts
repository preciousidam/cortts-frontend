import { Dimensions, PixelRatio, ScaledSize, useWindowDimensions } from 'react-native';

enum BASE {
  HEIGHT = 'height',
  WIDTH = 'width'
}

const { width, height }: ScaledSize = Dimensions.get('screen');

export enum baseScreen {
  WIDTH = 414,
  HEIGHT = 896
}

export enum baseScreenTab {
  WIDTH = 1440,
  HEIGHT = 1024
}

export const isLarger = width > 2560;

export const calcDevicePx = (px: number, base: BASE = BASE.WIDTH): number => {
  const widthBaseScale = width / baseScreen.WIDTH;
  const heightBaseScale = height / baseScreen.HEIGHT;
  const widthBaseScaleTablet = (width / baseScreenTab.WIDTH) * (2 / 3);
  const heightBaseScaleTablet = (height / baseScreenTab.HEIGHT) * (2 / 3);
  let newSize: number;
  if (!isLarger) {
    newSize = base === BASE.HEIGHT ? px * heightBaseScale : px * widthBaseScale;
  } else {
    newSize = base === BASE.HEIGHT ? px * heightBaseScaleTablet : px * widthBaseScaleTablet;
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

//for width  pixel
export const widthPixel = (size: number) => {
  return calcDevicePx(size, BASE.WIDTH);
};
//for height  pixel
export const heightPixel = (size: number) => {
  if (width <= height) {
    return calcDevicePx(size, BASE.WIDTH);
  } else {
    return calcDevicePx(size, BASE.HEIGHT);
  }
};

//for font  pixel
export const fontPixel = (size: number) => {
  return widthPixel(size);
};

//for line height
export const lineHeight = (size: number) => {
  return heightPixel(size);
};

export const useResponsive = () => {
  const { width, height }: ScaledSize = useWindowDimensions();
  const isPortrait = height >= width;
  const isLandscape = width > height;
  const widthBaseScale = width / baseScreen.WIDTH;
  const heightBaseScale = height / baseScreen.HEIGHT;

  const calcDevicePx = (px: number, base: BASE = BASE.WIDTH): number => {
    let newSize = base === BASE.HEIGHT ? px * heightBaseScale : px * widthBaseScale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  //for width  pixel
  const widthPixel = (size: number) => {
    return calcDevicePx(size, BASE.WIDTH);
  };

  //for height  pixel
  const heightPixel = (size: number) => {
    if (width <= height) {
      return calcDevicePx(size, BASE.WIDTH);
    } else {
      return calcDevicePx(size, BASE.HEIGHT);
    }
  };

  //for font  pixel
  const fontPixel = (size: number) => {
    return widthPixel(size);
  };

  //for line height
  const lineHeight = (size: number) => {
    return heightPixel(size);
  };

  return {
    width,
    height,
    isPortrait,
    isLandscape,
    widthBaseScale,
    heightBaseScale,
    widthPixel,
    heightPixel,
    fontPixel,
    lineHeight,
    scale: widthPixel,
    verticalScale: heightPixel
  };
};
