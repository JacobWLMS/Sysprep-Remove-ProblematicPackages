// Light Mode - Warm Wellness Aesthetic
export const lightColors = {
  // Primary - Calming olive green
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

  // SUD Scale Colors - warm, earthy tones
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

// Dark Mode - Warm Dark Aesthetic (not pure black)
export const darkColors = {
  // Primary - Calming olive green (same as light)
  primary: '#8BA888',
  primaryLight: '#A8C4A5',
  primaryDark: '#6E8C6B',
  primary10: 'rgba(139, 168, 136, 0.1)',
  primary20: 'rgba(139, 168, 136, 0.2)',
  primary30: 'rgba(139, 168, 136, 0.3)',
  primary50: 'rgba(139, 168, 136, 0.5)',

  // Secondary - Softer orange for dark mode
  secondary: '#D4883C',
  secondaryLight: '#E89C3B',
  secondaryDark: '#B87433',

  // Success - Muted green
  success: '#7A9A77',
  successLight: '#8BA888',
  successDark: '#668563',

  // Warning - Muted orange
  warning: '#D4883C',
  warningLight: '#E89C3B',
  warningDark: '#B87433',

  // Error - Muted coral
  error: '#D47A7A',
  errorLight: '#E88B8B',
  errorDark: '#B86565',

  // SUD Scale Colors - slightly muted for dark mode
  sud: {
    calm: '#7A9A77',      // 0-2: Muted green
    mild: '#A0B88A',      // 3-4: Soft green
    moderate: '#D9BF7A',  // 5-6: Muted yellow
    high: '#D4883C',      // 7-8: Muted orange
    severe: '#D47A7A',    // 9-10: Muted coral
  },

  // Neutrals - warm dark browns (NOT pure black)
  background: '#2A2520',          // Dark warm brown
  backgroundLight: '#342E28',     // Lighter warm brown
  backgroundElevated: '#3F3832',  // Elevated surfaces

  surface: '#342E28',
  surfaceLight: '#3F3832',
  surfaceDark: '#2A2520',

  // Text - light warm tones (inverted)
  textPrimary: '#F5F1ED',         // Cream
  textSecondary: '#D4CEC4',       // Light tan
  textTertiary: '#A89F94',        // Muted tan
  textDisabled: '#6B5D52',        // Muted brown

  // Borders
  border: '#4A453E',
  borderLight: '#56504A',
  borderDark: '#3A352E',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.85)',

  // Semantic colors
  rest: '#D9BF7A',       // Rest period indicator - muted yellow
  active: '#7A9A77',     // Active session indicator - muted green
  paused: '#A89F94',     // Paused state - muted tan

  // Accent colors for variety
  purple: '#9F8FC4',     // Muted purple accent
  purpleLight: '#B8A8D9',
  purpleDark: '#8675A8',

  brown: '#F5F1ED',      // Text color in dark mode
  brownLight: '#D4CEC4',
  brownDark: '#A89F94',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',      // Pure black for session screen
} as const;

// Default export for backward compatibility
export const colors = lightColors;

// Use a more flexible type that accommodates both light and dark themes
export type Colors = typeof lightColors | typeof darkColors;
