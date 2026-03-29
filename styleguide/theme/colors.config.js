/**
 * "The Curated Estate" Design System — Color Tokens
 * Material Design-mapped palette for use in tailwind.config.js.
 */

/** @type {Record<string, string | Record<string, string>>} */
const colors = {
  white: '#FFFFFF',

  // === Surface / Background Layers ===
  // Follow the "No-Line" rule: use background shifts, never borders, to section content.
  surface: '#fbf9f6',                 // Paper (Main Background)
  surfaceBright: '#ffffff',           // Financial data highlight / accent cards
  surfaceContainerLowest: '#ffffff',  // Level 2 — Active Cards
  surfaceContainerLow: '#f5f3f0',     // Stone (Tonal Surface)
  surfaceContainerHigh: '#e8e4de',    // Sidebar / elevated sections
  surfaceContainerHighest: '#dedad4', // Input field fill
  surfaceVariant: '#e2ddd8',          // Inactive progress track

  // === Semantic surface tokens (for backwards-compat class names) ===
  background: '#fbf9f6',
  card: '#ffffff',
  border: '#e6e8e9',         // Subtle Borders/Dividers (Light)

  // === Text ===
  text: {
    default: '#000104',   // Primary Text (Light Mode)
    weakest: '#c4c6cd',   // outline_variant — disabled / subtle
    weaker: '#71777f',    // Steel (Muted Text)
    weak: '#44474c',      // Charcoal (Secondary Text)
  },

  // === Primary Action — Estate Bronze (#715b3e) ===
  primary: {
    DEFAULT: '#715b3e',
    container: '#fcdeba',
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

  // === Secondary — Muted Gold/Bronze (#715b3e) ===
  // Denotes luxury and status. secondaryContainer = warm glow hover.
  secondary: {
    DEFAULT: '#715b3e',
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

  detail: {
    divider: '#e6e8e9',
    dividerDark: '#2c3e50',
    interactive: '#715b3e10',
    interactiveDark: '#fcdeba10',
    progress: '#71777f',
    overlay: 'rgba(15, 29, 45, 0.4)',
  },

  // Legacy brand shortcuts
  brand: {
    blue: '#0f1d2d',   // Ink Navy (primary)
    green: '#715b3e',  // Muted Gold/Bronze (secondary)
  },

  // === Neutral — Warm grays ===
  neutral: {
    light: '#f5f3f0',
    lightHover: '#edeeea',
    lightActive: '#e6e8e9',
    normal: '#71777f',
    normalHover: '#666b73',
    normalActive: '#5b6068',
    dark: '#44474c',
    darkHover: '#393d42',
    darkActive: '#2e3237',
    darker: '#23272b',
  },

  // Outline tokens
  outline: '#72757e',
  outlineVariant: '#e6e8e9',
  onSurface: '#1b1c1a',
  onSurfaceVariant: '#44474c',

  // === Dark mode equivalents — use with dark: prefix ===
  dark: {
    background: '#0f1d2d',
    card: '#1b2a3a',
    border: '#2c3e50',
    text: '#fbf9f6',
    textWeak: '#c4c6cd',
    textWeaker: '#a6aaaf',
    textWeakest: '#7a7d82',
    primary: '#fcdeba',
    onPrimary: '#0f1d2d',
  },

  // === Semantic status colors (unchanged) ===
  error: {
    light: '#f2dddd',
    lightHover: '#eccfcf',
    lightActive: '#ddb0b0',
    normal: '#8e2d2d',
    normalHover: '#7f2828',
    normalActive: '#702323',
    dark: '#611e1e',
    darkHover: '#521919',
    darkActive: '#431414',
    darker: '#340f0f',
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
    light: '#d8f2ed',
    lightHover: '#c6ebe4',
    lightActive: '#a9ddd2',
    normal: '#06a58a',
    normalHover: '#05957c',
    normalActive: '#04856f',
    dark: '#037562',
    darkHover: '#036555',
    darkActive: '#025548',
    darker: '#01453b',
  },

  pending: {
    light: '#eceef1',
    lightHover: '#dde1e6',
    lightActive: '#c9ced6',
    normal: '#71777f',
    normalHover: '#666b73',
    normalActive: '#5b6068',
    dark: '#50545b',
    darkHover: '#454950',
    darkActive: '#3a3e45',
    darker: '#30343a',
  },
};

module.exports = colors;
