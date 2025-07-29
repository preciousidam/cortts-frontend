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


export const generateColorScale = (hex: string) => {
  const base = Color(hex).hsl();

  return {
    light: base.saturate(-0.3).lighten(0.54).hex(),         // ~94% lightness
    lightHover: base.saturate(-0.3).lighten(0.49).hex(),     // ~91%
    lightActive: base.saturate(-0.2).lighten(0.41).hex(),    // ~81%
    normalBase: base.hex(),
    normalHover: base.darken(0.1).hex(),
    normalActive: base.darken(0.2).hex(),
    dark: base.darken(0.3).hex(),
    darkHover: base.darken(0.45).hex(),
    darkActive: base.darken(0.6).hex(),
    darker: base.darken(0.75).hex(),
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
  warning:  '#FFC115' // yellow for warning messages
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
  warning:  '#FFC115'  // yellow for warning messages
};

