/** @type {import('tailwindcss').Config} */
const themeColors = require('./styleguide/theme/colors.config');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './constants/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: themeColors,

      fontFamily: {
        // Manrope — Body & Labels ("the engine")
        regular:    ['Manrope_400Regular'],
        medium:     ['Manrope_500Medium'],
        semibold:   ['Manrope_600SemiBold'],
        bold:       ['Manrope_700Bold'],
        // Noto Serif JP — Display & Headlines ("the voice")
        serif:      ['NotoSerifJP_400Regular'],
        serifMedium:['NotoSerifJP_500Medium'],
        serifBold:  ['NotoSerifJP_700Bold'],
      },

      fontSize: {
        // Material Design type scale
        'display-lg': ['56px', { lineHeight: '64px' }],   // hero property titles
        'headline-lg': ['36px', { lineHeight: '44px' }],
        'headline-md': ['28px', { lineHeight: '36px' }],  // section headers
        'headline-sm': ['24px', { lineHeight: '32px' }],
        'body-lg':  ['16px', { lineHeight: '24px' }],     // primary body text (1rem)
        'body-md':  ['14px', { lineHeight: '20px' }],
        'body-sm':  ['12px', { lineHeight: '16px' }],
        'label-lg': ['14px', { lineHeight: '20px' }],
        'label-md': ['12px', { lineHeight: '16px' }],
        'label-sm': ['11px', { lineHeight: '16px' }],
        // Legacy sizes (preserved for existing components)
        caption:  ['12px', { lineHeight: '16px' }],
        body:     ['14px', { lineHeight: '20px' }],
        subtitle: ['24px', { lineHeight: '32px' }],
        h2:       ['44px', { lineHeight: '52px' }],
        h1:       ['48px', { lineHeight: '56px' }],
      },

      borderRadius: {
        // New spec radii — "no sharp 0px corners"
        sm:     '2px',    // 0.125rem — minimum on any element
        md:     '6px',    // 0.375rem — inputs
        lg:     '8px',
        xl:     '12px',   // 0.75rem — cards, images, primary buttons
        '2xl':  '16px',
        circle: '9999px',
        // Legacy (preserved for existing components)
        s:      '4px',
        m:      '8px',
        large:  '16px',
      },

      boxShadow: {
        // Ambient shadow — "natural light hitting an object"
        ambient: '0 4px 32px rgba(27, 28, 26, 0.05)',
        card:    '0 4px 32px rgba(27, 28, 26, 0.05)',
      },
    }
  },
  plugins: []
};
