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
  primary: '#007ACC',         // links, active icons
  background: '#FAFAFA',      // screen background
  card: '#FFFFFF',            // header, drawer, bottom tabs
  // text: '#292929',            // body text
  border: '#E5E5E5',          // card/drawer/tab borders
  notification: '#DF0000',  // red for error messages
  // neutral: '#ABABAB',      // neutral text color
  // textWeaker: '#B8B8B8',   // weaker text color
  // textWeakest: '#E8E8E8', // weakest text color
  // textWeak: '#4D4D4D', // weak text color
  success: '#22C55E', // green for success messages
  // warning:  '#FFC115', // yellow for warning messages
  secondary: '#00C1A2'
};

export const corttsDarkColors = {
  primary: '#00C1A2',         // teal for CTA & active highlights
  background: '#1A1A1A',      // full screen dark background
  card: '#2A2A2A',            // headers, drawers, modals
  text: '#FFFFFF',            // main text color
  border: '#4F4F4F',          // divider lines, input borders
  notification: '#DF0000',  // red for error messages
  neutral: '#ABABAB',      // neutral text color
  textWeaker: '#8C8C8C',   // weaker text color
  textWeakest: '#3D3D3D', // weakest text color
  textWeak: '#CFCFCF', // weak text color
  success: '#22C55E',  // green for success messages
  warning:  '#FFC115',  // yellow for warning messages
  secondary: '#007ACC'
};

export const colors = {
  white: "#FFFFFF",

  // top swatches
  brand: {
    blue: "#1F73BD",
    green: "#1FB99B",
  },

  text: {
    default: "#252525",
    weakest: "#E4E4E4",
    weaker: "#AFAFAF",
    weak: "#5A5A5A",
  },

  primaryBlue: {
    light: "#F2F2F2",
    lightHover: "#ECECEC",
    lightActive: "#D9D9D9",
    normal: "#1F73BD",
    normalHover: "#1A619F",
    normalActive: "#17558B",
    dark: "#154A78",
    darkHover: "#133E66",
    darkActive: "#113555",
    darker: "#0E2C47",
  },

  secondaryGreen: {
    light: "#E5F9F6",
    lightHover: "#DBF6F1",
    lightActive: "#BEEFE6",
    normal: "#1FB99B",
    normalHover: "#1A9F85",
    normalActive: "#178B74",
    dark: "#157B65",
    darkHover: "#126856",
    darkActive: "#105949",
    darker: "#0D4A3D",
  },

  neutral: {
    light: "#F7F7F7",
    lightHover: "#F2F2F2",
    lightActive: "#E5E5E5",
    normal: "#ABABAB",
    normalHover: "#9A9A9A",
    normalActive: "#898989",
    dark: "#808080",
    darkHover: "#676767",
    darkActive: "#4D4D4D",
    darker: "#3C3C3C",
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
    "default": "#FFFFFF",
    "weak": "#E0E0E0",
    "weaker": "#A0A0A0",
    "weakest": "#6E6E6E"
}