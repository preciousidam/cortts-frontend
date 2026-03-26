import Color from 'color';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark
  }
};


const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

// Blend current L toward a target absolute L by factor k (0..1)
const blendTo = (L: number, target: number, k: number) => clamp(L + (target - L) * k);

// Absolute lightness targets (tints) chosen to match your spec sheet
const L_TARGETS = {
  light: 98,
  lightHover: 94,
  lightActive: 88,
};

// Shade deltas from base L chosen to mirror your “normal/dark” steps
const SHADE_DELTAS = {
  hover: 6,
  active: 12,
  dark: 20,
  darkHover: 30,
  darkActive: 40,
  darker: 48,
};

// Saturation shaping
const tintSat = (s: number, strength: number) => clamp(s * (1 - strength));   // reduce by %
const shadeSat = (s: number, strength: number) => clamp(s * (1 + strength));  // increase by %

/**
 * A palette tuned to match your Light → Darker ladder.
 * Works well for mid and deep bases, and keeps very-light bases from washing out.
 */
export const generateColorScale = (hex: string) => {
  const base = Color(hex).hsl(); // HSL in [0..360, 0..100, 0..100]
  const { h, s, l } = base.object() as { h: number; s: number; l: number };

  // How strongly we pull toward absolute tint targets depends on how far we are
  // (keeps extremely light bases from over-shooting)
  const kTint = (targetL: number) => {
    const headroom = Math.max(0, targetL - l);           // how much room to go brighter
    const span = Math.max(10, 100 - l);                  // normalize
    return clamp(0.75 * (headroom / span), 0.45, 0.85);  // bounded blend → “feels” like the sheet
  };

  // Shades are gentle deltas with a floor so they don't go dead-black
  const shadeL = (delta: number) => clamp(l - delta, 10, 92);

  // Tints: desaturate modestly; more desat for lighter targets
  const sLight        = tintSat(s, 0.28);
  const sLightHover   = tintSat(s, 0.22);
  const sLightActive  = tintSat(s, 0.12);

  // Shades: small sat lift to keep colorfulness in darker steps
  const sHover        = shadeSat(s, 0.05);
  const sActive       = shadeSat(s, 0.08);
  const sDark         = shadeSat(s, 0.10);
  const sDarkHover    = shadeSat(s, 0.12);
  const sDarkActive   = shadeSat(s, 0.14);
  const sDarker       = shadeSat(s, 0.16);

  return {
    // Tints (toward ~96/92/84)
    light:       Color.hsl(h, sLight,       blendTo(l, L_TARGETS.light,       kTint(L_TARGETS.light))).hex(),
    lightHover:  Color.hsl(h, sLightHover,  blendTo(l, L_TARGETS.lightHover,  kTint(L_TARGETS.lightHover))).hex(),
    lightActive: Color.hsl(h, sLightActive, blendTo(l, L_TARGETS.lightActive, kTint(L_TARGETS.lightActive))).hex(),

    // Base
    normal: base.hex(),

    // Shades (small, then medium steps)
    normalHover:  Color.hsl(h, sHover,      shadeL(SHADE_DELTAS.hover)).hex(),
    normalActive: Color.hsl(h, sActive,     shadeL(SHADE_DELTAS.active)).hex(),
    dark:         Color.hsl(h, sDark,       shadeL(SHADE_DELTAS.dark)).hex(),
    darkHover:    Color.hsl(h, sDarkHover,  shadeL(SHADE_DELTAS.darkHover)).hex(),
    darkActive:   Color.hsl(h, sDarkActive, shadeL(SHADE_DELTAS.darkActive)).hex(),
    darker:       Color.hsl(h, sDarker,     shadeL(SHADE_DELTAS.darker)).hex(),
  };
};


export const corttsLightColors = {
  primary: '#0f1d2d',         // Ink Navy — links, active icons
  background: '#fbf9f6',      // warm bone — screen background
  card: '#ffffff',            // header, drawer, bottom tabs
  border: '#c4c6cd',          // outline_variant — Ghost Border
  notification: '#D00000',    // error red
  success: '#22C55E',         // green for success messages
  secondary: '#8b7355',       // Muted Gold/Bronze
  tertiary: '#2d4b3f',        // Forest Green
};

export const corttsDarkColors = {
  primary: '#4a7aa8',         // lightened Ink Navy for dark mode CTAs
  background: '#0d1117',      // deep dark background
  card: '#1a2232',            // headers, drawers, modals
  text: '#f5f3f0',            // warm off-white — main text
  border: '#2d3a4a',          // dark border
  notification: '#D00000',    // error red
  textWeaker: '#72757e',      // tertiary labels
  textWeakest: '#44474c',     // disabled / subtle
  textWeak: '#c4c6cd',        // secondary labels
  success: '#22C55E',         // green for success messages
  warning: '#FFB015',         // yellow for warning messages
  secondary: '#c4a97d',       // lightened Bronze for dark mode
  tertiary: '#3d6b5a',
};

export const colors = {
  white: "#FFFFFF",

  brand: {
    blue: "#0f1d2d",   // Ink Navy (primary)
    green: "#8b7355",  // Muted Gold/Bronze (secondary)
  },

  text: {
    default: "#1b1c1a",   // deep warm black
    weakest: "#c4c6cd",   // outline_variant
    weaker: "#72757e",    // tertiary labels
    weak: "#44474c",      // on_surface_variant
  },

  primaryBlue: {
    light: "#e8ecf0",
    lightHover: "#dae1e8",
    lightActive: "#c5d0da",
    normal: "#0f1d2d",
    normalHover: "#0c1826",
    normalActive: "#091420",
    dark: "#081119",
    darkHover: "#050d12",
    darkActive: "#03080b",
    darker: "#020508",
  },

  secondaryGreen: {
    light: "#f5ede2",
    lightHover: "#ede2d4",
    lightActive: "#d9c8ae",
    normal: "#8b7355",
    normalHover: "#7d6849",
    normalActive: "#6e5c3f",
    dark: "#5f4f35",
    darkHover: "#4d3f2a",
    darkActive: "#3c3020",
    darker: "#2d2318",
  },

  neutral: {
    light: "#f5f3f0",
    lightHover: "#ede9e4",
    lightActive: "#e2ddd8",
    normal: "#8a8782",
    normalHover: "#797470",
    normalActive: "#68655f",
    dark: "#57544f",
    darkHover: "#44413d",
    darkActive: "#322f2c",
    darker: "#201e1b",
  },

  error: {
    light: "#FCE6E6",
    lightHover: "#FAD9D9",
    lightActive: "#F5B0B0",
    normal: "#D00000",
    normalHover: "#C90000",
    normalActive: "#B20000",
    dark: "#A70000",
    darkHover: "#860000",
    darkActive: "#640000",
    darker: "#4E0000",
  },

  warning: {
    light: "#FFF9EB",
    lightHover: "#FFF8DC",
    lightActive: "#FFF2BC",
    normal: "#FFB015",
    normalHover: "#E6AE13",
    normalActive: "#CC9A11",
    dark: "#BF9110",
    darkHover: "#99740D",
    darkActive: "#735709",
    darker: "#594407",
  },

  successful: {
    light: "#E9F9EF",
    lightHover: "#DEF6E7",
    lightActive: "#BAEDCD",
    normal: "#22C55E",
    normalHover: "#1FB155",
    normalActive: "#1B9E4B",
    dark: "#1A9447",
    darkHover: "#147638",
    darkActive: "#0F592A",
    darker: "#0C4521",
  },
};

export type ColorType = typeof colors;
export type ColorScale = {
  light: string;
  lightHover: string;
  lightActive: string;
  normal: string;
  normalHover: string;
  normalActive: string;
  dark: string;
  darkHover: string;
  darkActive: string;
  darker: string;
};

export type ColorScales = {
  primaryBlue: ColorScale;
  secondaryGreen: ColorScale;
  neutral: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  successful: ColorScale;
};

export const lightTextColors = {
  default: "#f5f3f0",
  weak: "#c4c6cd",
  weaker: "#72757e",
  weakest: "#44474c",
};
