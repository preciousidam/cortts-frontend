import { widthPixel } from "@/utilities/responsive";

export const ROUNDNESS = {
  s: {
    borderRadius: widthPixel(4),
    borderWidth: 1,
    borderColor: 'transparent'
  },
  m: {
    borderRadius: widthPixel(8),
    borderWidth: 1,
    borderColor: 'transparent'
  },
  large: {
    borderRadius: widthPixel(16),
    borderWidth: 1,
    borderColor: 'transparent'
  },
  circle: {
    borderRadius: widthPixel(100000),
    borderWidth: 1,
    borderColor: 'transparent'
  }
};