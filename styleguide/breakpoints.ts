export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const breakpointRank: Record<Breakpoint, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const getBreakpoint = (width: number): Breakpoint => {
  if (width < 360) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
};

export const isGte = (a: Breakpoint, b: Breakpoint) => breakpointRank[a] >= breakpointRank[b];
export const isGt = (a: Breakpoint, b: Breakpoint) => breakpointRank[a] > breakpointRank[b];
export const isLt = (a: Breakpoint, b: Breakpoint) => breakpointRank[a] < breakpointRank[b];
export const isLte = (a: Breakpoint, b: Breakpoint) => breakpointRank[a] <= breakpointRank[b];
