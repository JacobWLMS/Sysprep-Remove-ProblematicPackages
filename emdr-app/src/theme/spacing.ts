// 4px base spacing scale - more generous for wellness aesthetic
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// Semantic spacing - more generous for calm aesthetic
export const layout = {
  screenPadding: spacing[6],       // 24px (more generous)
  cardPadding: spacing[6],          // 24px (more generous)
  sectionSpacing: spacing[8],       // 32px (more generous)
  itemSpacing: spacing[4],          // 16px (more generous)
  minTouchTarget: 48,               // Slightly larger for easier tapping
} as const;

// More rounded corners for softer aesthetic
export const borderRadius = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  full: 9999,
} as const;

// Softer, more subtle shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
