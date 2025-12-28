export const colors = {
  // Primary - Calming blue (like Headspace/Calm)
  primary: '#00A8E8',
  primaryLight: '#33BCEE',
  primaryDark: '#0080B3',
  primary10: 'rgba(0, 168, 232, 0.1)',
  primary20: 'rgba(0, 168, 232, 0.2)',
  primary30: 'rgba(0, 168, 232, 0.3)',
  primary50: 'rgba(0, 168, 232, 0.5)',

  // Secondary - Warm accent
  secondary: '#9C27B0',
  secondaryLight: '#BA68C8',
  secondaryDark: '#7B1FA2',

  // Success - Calm green
  success: '#00C853',
  successLight: '#5EFC82',
  successDark: '#009624',

  // Warning - Gentle orange
  warning: '#FF6F00',
  warningLight: '#FFA040',
  warningDark: '#C43E00',

  // Error - Soft red
  error: '#F50057',
  errorLight: '#FF5983',
  errorDark: '#C51162',

  // SUD Scale Colors (gradient from calm to distressed)
  sud: {
    calm: '#00C853',      // 0-2: Green
    mild: '#64DD17',      // 3-4: Light green
    moderate: '#FFD600',  // 5-6: Yellow
    high: '#FF6F00',      // 7-8: Orange
    severe: '#F50057',    // 9-10: Red
  },

  // Neutrals
  background: '#0a0a0a',
  backgroundLight: '#1a1a1a',
  backgroundElevated: '#2a2a2a',

  surface: '#1a1a1a',
  surfaceLight: '#2a2a2a',
  surfaceDark: '#0a0a0a',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  textDisabled: '#666666',

  // Borders
  border: '#333333',
  borderLight: '#444444',
  borderDark: '#222222',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Semantic colors
  rest: '#FFD600',       // Rest period indicator
  active: '#00A8E8',     // Active session indicator
  paused: '#999999',     // Paused state

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
