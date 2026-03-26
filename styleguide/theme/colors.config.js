/**
 * "The Curated Estate" Design System — Color Tokens
 * Material Design-mapped palette for use in tailwind.config.js.
 */

/** @type {Record<string, string | Record<string, string>>} */
const colors = {
  white: '#FFFFFF',

  // === Surface / Background Layers ===
  // Follow the "No-Line" rule: use background shifts, never borders, to section content.
  surface: '#fbf9f6',                 // Level 0 — Core Background (warm bone)
  surfaceBright: '#ffffff',           // Financial data highlight / accent cards
  surfaceContainerLowest: '#ffffff',  // Level 2 — Active Cards
  surfaceContainerLow: '#f5f3f0',     // Level 1 — Sub-sections
  surfaceContainerHigh: '#e8e4de',    // Sidebar / elevated sections
  surfaceContainerHighest: '#dedad4', // Input field fill
  surfaceVariant: '#e2ddd8',          // Inactive progress track

  // === Semantic surface tokens (for backwards-compat class names) ===
  background: '#fbf9f6',
  card: '#ffffff',
  border: '#c4c6cd',         // outline_variant — Ghost Border base

  // === Text ===
  text: {
    default: '#1b1c1a',   // Deep warm black — never pure #000
    weakest: '#c4c6cd',   // outline_variant — disabled / subtle
    weaker: '#72757e',    // tertiary labels
    weak: '#44474c',      // on_surface_variant — secondary labels
  },

  // === Primary — Ink Navy (#0f1d2d) ===
  // Used for branding, navigation, primary CTAs (gradient to primaryContainer)
  primary: {
    DEFAULT: '#0f1d2d',
    container: '#1a3050',
    on: '#ffffff',
  },

  // Legacy scale — mapped to new Ink Navy (replaces old primaryBlue)
  primaryBlue: {
    light: '#e8ecf0',
    lightHover: '#dae1e8',
    lightActive: '#c5d0da',
    normal: '#0f1d2d',
    normalHover: '#0c1826',
    normalActive: '#091420',
    dark: '#081119',
    darkHover: '#050d12',
    darkActive: '#03080b',
    darker: '#020508',
  },

  // === Secondary — Muted Gold/Bronze (#8b7355) ===
  // Denotes luxury and status. secondaryContainer = warm glow hover.
  secondary: {
    DEFAULT: '#8b7355',
    container: '#f4e8d6',  // warm hover / "glow" effect
    fixed: '#fcdeba',      // Status Ribbon background
    onFixed: '#281903',    // Status Ribbon text
    on: '#ffffff',
  },

  // Legacy scale — mapped to new Bronze (replaces old secondaryGreen)
  secondaryGreen: {
    light: '#f5ede2',
    lightHover: '#ede2d4',
    lightActive: '#d9c8ae',
    normal: '#8b7355',
    normalHover: '#7d6849',
    normalActive: '#6e5c3f',
    dark: '#5f4f35',
    darkHover: '#4d3f2a',
    darkActive: '#3c3020',
    darker: '#2d2318',
  },

  // === Tertiary — Forest Green (#2d4b3f) ===
  // Subtle interactive elements and tertiary actions.
  tertiary: {
    DEFAULT: '#2d4b3f',
    container: '#3d6b5a',
    on: '#ffffff',
  },

  // Legacy brand shortcuts
  brand: {
    blue: '#0f1d2d',   // Ink Navy (primary)
    green: '#8b7355',  // Muted Gold/Bronze (secondary)
  },

  // === Neutral — Warm grays ===
  neutral: {
    light: '#f5f3f0',
    lightHover: '#ede9e4',
    lightActive: '#e2ddd8',
    normal: '#8a8782',
    normalHover: '#797470',
    normalActive: '#68655f',
    dark: '#57544f',
    darkHover: '#44413d',
    darkActive: '#322f2c',
    darker: '#201e1b',
  },

  // Outline tokens
  outline: '#72757e',
  outlineVariant: '#c4c6cd',
  onSurface: '#1b1c1a',
  onSurfaceVariant: '#44474c',

  // === Dark mode equivalents — use with dark: prefix ===
  dark: {
    background: '#0d1117',
    card: '#1a2232',
    border: '#2d3a4a',
    text: '#f5f3f0',
    textWeak: '#c4c6cd',
    textWeaker: '#72757e',
    textWeakest: '#44474c',
  },

  // === Semantic status colors (unchanged) ===
  error: {
    light: '#FCE6E6',
    lightHover: '#FAD9D9',
    lightActive: '#F5B0B0',
    normal: '#D00000',
    normalHover: '#C90000',
    normalActive: '#B20000',
    dark: '#A70000',
    darkHover: '#860000',
    darkActive: '#640000',
    darker: '#4E0000',
  },

  warning: {
    light: '#FFF9EB',
    lightHover: '#FFF8DC',
    lightActive: '#FFF2BC',
    normal: '#FFB015',
    normalHover: '#E6AE13',
    normalActive: '#CC9A11',
    dark: '#BF9110',
    darkHover: '#99740D',
    darkActive: '#735709',
    darker: '#594407',
  },

  successful: {
    light: '#E9F9EF',
    lightHover: '#DEF6E7',
    lightActive: '#BAEDCD',
    normal: '#22C55E',
    normalHover: '#1FB155',
    normalActive: '#1B9E4B',
    dark: '#1A9447',
    darkHover: '#147638',
    darkActive: '#0F592A',
    darker: '#0C4521',
  },
};

module.exports = colors;
