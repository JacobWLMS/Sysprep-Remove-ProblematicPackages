import { colors, lightColors, darkColors, Colors } from './colors';
import { typography, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, layout, borderRadius, shadows } from './spacing';

// Default theme (light mode) for backward compatibility
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
export { colors, lightColors, darkColors } from './colors';
export type { Colors } from './colors';
export { typography, fontSizes, fontWeights, lineHeights } from './typography';
export { spacing, layout, borderRadius, shadows } from './spacing';

// Export theme context
export { ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';

// Helper to get SUD color based on value (accepts colors object for theming)
export const getSUDColor = (value: number, themeColors: Colors = colors): string => {
  if (value <= 2) return themeColors.sud.calm;
  if (value <= 4) return themeColors.sud.mild;
  if (value <= 6) return themeColors.sud.moderate;
  if (value <= 8) return themeColors.sud.high;
  return themeColors.sud.severe;
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

// SUD scale data for picker (accepts colors object for theming)
export const getSUDScale = (themeColors: Colors = colors) => [
  { value: 0, emoji: '😌', label: 'No distress', color: themeColors.sud.calm },
  { value: 1, emoji: '😌', label: 'Minimal', color: themeColors.sud.calm },
  { value: 2, emoji: '🙂', label: 'Very mild', color: themeColors.sud.calm },
  { value: 3, emoji: '🙂', label: 'Mild', color: themeColors.sud.mild },
  { value: 4, emoji: '😐', label: 'Mild-moderate', color: themeColors.sud.mild },
  { value: 5, emoji: '😐', label: 'Moderate', color: themeColors.sud.moderate },
  { value: 6, emoji: '😟', label: 'Moderate-high', color: themeColors.sud.moderate },
  { value: 7, emoji: '😟', label: 'High', color: themeColors.sud.high },
  { value: 8, emoji: '😰', label: 'Very high', color: themeColors.sud.high },
  { value: 9, emoji: '😰', label: 'Severe', color: themeColors.sud.severe },
  { value: 10, emoji: '😱', label: 'Worst imaginable', color: themeColors.sud.severe },
];

// Backward compatibility - default SUD scale using light colors
export const SUD_SCALE = getSUDScale(colors);
