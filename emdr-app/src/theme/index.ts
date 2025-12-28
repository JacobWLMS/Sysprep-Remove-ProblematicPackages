import { colors } from './colors';
import { typography, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, layout, borderRadius, shadows } from './spacing';

export const theme = {
  colors,
  typography,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  layout,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

// Export individual modules
export { colors } from './colors';
export { typography, fontSizes, fontWeights, lineHeights } from './typography';
export { spacing, layout, borderRadius, shadows } from './spacing';

// Helper to get SUD color based on value
export const getSUDColor = (value: number): string => {
  if (value <= 2) return colors.sud.calm;
  if (value <= 4) return colors.sud.mild;
  if (value <= 6) return colors.sud.moderate;
  if (value <= 8) return colors.sud.high;
  return colors.sud.severe;
};

// Helper to get SUD emoji based on value
export const getSUDEmoji = (value: number): string => {
  if (value === 0) return '😌';
  if (value <= 2) return '🙂';
  if (value <= 4) return '😐';
  if (value <= 6) return '😟';
  if (value <= 8) return '😰';
  return '😱';
};

// SUD scale data for picker
export const SUD_SCALE = [
  { value: 0, emoji: '😌', label: 'No distress', color: colors.sud.calm },
  { value: 1, emoji: '😌', label: 'Minimal', color: colors.sud.calm },
  { value: 2, emoji: '🙂', label: 'Very mild', color: colors.sud.calm },
  { value: 3, emoji: '🙂', label: 'Mild', color: colors.sud.mild },
  { value: 4, emoji: '😐', label: 'Mild-moderate', color: colors.sud.mild },
  { value: 5, emoji: '😐', label: 'Moderate', color: colors.sud.moderate },
  { value: 6, emoji: '😟', label: 'Moderate-high', color: colors.sud.moderate },
  { value: 7, emoji: '😟', label: 'High', color: colors.sud.high },
  { value: 8, emoji: '😰', label: 'Very high', color: colors.sud.high },
  { value: 9, emoji: '😰', label: 'Severe', color: colors.sud.severe },
  { value: 10, emoji: '😱', label: 'Worst imaginable', color: colors.sud.severe },
];
