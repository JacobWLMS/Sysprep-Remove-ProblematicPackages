import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { Colors } from '../../theme';

export interface TextProps {
  children: React.ReactNode;
  variant?:
    | 'display'
    | 'displayMedium'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'bodyLarge'
    | 'bodySmall'
    | 'label'
    | 'labelLarge'
    | 'labelSmall'
    | 'caption'
    | 'captionBold';
  color?: keyof Colors;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  numberOfLines?: number;
  testID?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'textPrimary',
  align = 'left',
  style,
  numberOfLines,
  testID,
}) => {
  const { theme } = useTheme();

  const textStyle = [
    theme.typography[variant],
    { color: theme.colors[color] },
    { textAlign: align },
    style,
  ];

  return (
    <RNText style={textStyle} numberOfLines={numberOfLines} testID={testID}>
      {children}
    </RNText>
  );
};
