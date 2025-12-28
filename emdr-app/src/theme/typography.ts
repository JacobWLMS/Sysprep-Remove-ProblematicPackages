import { TextStyle } from 'react-native';

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 72,
  '8xl': 96,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2,
} as const;

export const typography = {
  // Display - for huge numbers/stats (softer, more calming)
  display: {
    fontSize: fontSizes['8xl'],
    fontWeight: fontWeights.semibold,  // Reduced from bold
    lineHeight: fontSizes['8xl'] * lineHeights.normal,  // Increased for breathing room
    letterSpacing: -1,  // Reduced negative spacing for friendlier feel
  },
  displayMedium: {
    fontSize: fontSizes['7xl'],
    fontWeight: fontWeights.semibold,  // Reduced from bold
    lineHeight: fontSizes['7xl'] * lineHeights.normal,
    letterSpacing: -0.5,  // Reduced negative spacing
  },

  // Headings (gentler weights, more breathing room)
  h1: {
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.semibold,  // Reduced from bold
    lineHeight: fontSizes['5xl'] * lineHeights.normal,  // More space
    letterSpacing: -0.5,  // Gentler spacing
  },
  h2: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.semibold,  // Reduced from bold
    lineHeight: fontSizes['4xl'] * lineHeights.normal,
    letterSpacing: 0,  // Neutral spacing
  },
  h3: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes['3xl'] * lineHeights.normal,
    letterSpacing: 0,
  },
  h4: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
    letterSpacing: 0,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes.xl * lineHeights.relaxed,  // More space
  },
  h6: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes.lg * lineHeights.relaxed,
  },

  // Body text (increased size and line height for comfort)
  body: {
    fontSize: fontSizes.md,  // Increased from base for better readability
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,  // Increased from md
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
  },
  bodySmall: {
    fontSize: fontSizes.base,  // Increased from sm
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.relaxed,  // More space
  },

  // Labels
  label: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  labelLarge: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  labelSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },

  // Button text (softer, more inviting)
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes.md * lineHeights.normal,
    letterSpacing: 0.2,  // Slightly reduced
  },
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,  // Reduced from bold
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,  // Reduced from semibold
    lineHeight: fontSizes.base * lineHeights.normal,
  },

  // Caption
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.xs * lineHeights.normal,
  },
  captionBold: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
} as const;

export type Typography = typeof typography;
