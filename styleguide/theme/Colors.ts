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
    normalBase: base.hex(),

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
  text: '#292929',            // body text
  border: '#E5E5E5',          // card/drawer/tab borders
  notification: '#DF0000',  // red for error messages
  neutral: '#ABABAB',      // neutral text color
  textWeaker: '#B8B8B8',   // weaker text color
  textWeakest: '#E8E8E8', // weakest text color
  textWeak: '#4D4D4D', // weak text color
  success: '#22C55E', // green for success messages
  warning:  '#FFC115', // yellow for warning messages
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

