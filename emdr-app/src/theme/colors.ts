export const colors = {
  // Primary - Calming olive green (wellness aesthetic)
  primary: '#8BA888',
  primaryLight: '#A8C4A5',
  primaryDark: '#6E8C6B',
  primary10: 'rgba(139, 168, 136, 0.1)',
  primary20: 'rgba(139, 168, 136, 0.2)',
  primary30: 'rgba(139, 168, 136, 0.3)',
  primary50: 'rgba(139, 168, 136, 0.5)',

  // Secondary - Warm orange accent
  secondary: '#E89C3B',
  secondaryLight: '#F4B968',
  secondaryDark: '#C67E1F',

  // Success - Soft green
  success: '#8BA888',
  successLight: '#A8C4A5',
  successDark: '#6E8C6B',

  // Warning - Gentle orange
  warning: '#E89C3B',
  warningLight: '#F4B968',
  warningDark: '#C67E1F',

  // Error - Soft coral/rose
  error: '#E88B8B',
  errorLight: '#F4A8A8',
  errorDark: '#C66E6E',

  // SUD Scale Colors (gradient from calm to distressed) - warm, earthy tones
  sud: {
    calm: '#8BA888',      // 0-2: Calm green
    mild: '#B5C99A',      // 3-4: Light green
    moderate: '#F4D58D',  // 5-6: Soft yellow
    high: '#E89C3B',      // 7-8: Warm orange
    severe: '#E88B8B',    // 9-10: Soft coral
  },

  // Neutrals - warm, earthy palette
  background: '#F5F1ED',          // Cream/beige
  backgroundLight: '#FFFBF7',     // Light cream
  backgroundElevated: '#FFFFFF',  // Pure white for cards

  surface: '#FFFFFF',
  surfaceLight: '#FFFBF7',
  surfaceDark: '#F5F1ED',

  // Text - warm browns
  textPrimary: '#4A3F35',         // Dark brown
  textSecondary: '#6B5D52',       // Medium brown
  textTertiary: '#9B8E81',        // Light brown
  textDisabled: '#C4BBB2',        // Very light brown

  // Borders
  border: '#E8DFD7',
  borderLight: '#F0E9E2',
  borderDark: '#D4C9BF',

  // Overlays
  overlay: 'rgba(74, 63, 53, 0.5)',
  overlayLight: 'rgba(74, 63, 53, 0.3)',
  overlayDark: 'rgba(74, 63, 53, 0.7)',

  // Semantic colors
  rest: '#F4D58D',       // Rest period indicator - soft yellow
  active: '#8BA888',     // Active session indicator - green
  paused: '#9B8E81',     // Paused state - light brown

  // Accent colors for variety
  purple: '#B8A8D9',     // Soft purple accent
  purpleLight: '#D4C9ED',
  purpleDark: '#9985C4',

  brown: '#5A4A3F',      // Rich brown
  brownLight: '#6B5D52',
  brownDark: '#4A3F35',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
