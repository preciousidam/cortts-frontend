import { useResponsive } from '@/hooks/useResponsive';

export const useRoundness = () => {
  const { widthPixel } = useResponsive();

  return {
    s: {
      borderRadius: widthPixel(4),
      borderWidth: 1,
      borderColor: 'transparent',
    },
    m: {
      borderRadius: widthPixel(8),
      borderWidth: 1,
      borderColor: 'transparent',
    },
    large: {
      borderRadius: widthPixel(16),
      borderWidth: 1,
      borderColor: 'transparent',
    },
    circle: {
      borderRadius: widthPixel(9999),
      borderWidth: 1,
      borderColor: 'transparent',
    },
  };
};