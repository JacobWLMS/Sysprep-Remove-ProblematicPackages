import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Text } from './Text';
import { useTheme } from '../../theme';

interface Action {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
}

interface AppHeaderProps {
  title?: React.ReactNode;
  left?: Action | null;
  right?: Action | null;
  compact?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, left, right, compact = false }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme, insets, compact), [theme, insets, compact]);

  return (
    <View style={styles.container}>
      <View style={styles.sideLeft}>{left ? <Button variant="ghost" size="small" onPress={left.onPress} icon={left.icon}>{left.label}</Button> : <View />}</View>
      <View style={styles.titleWrap}>
        {typeof title === 'string' ? (
          <Text variant={compact ? "h3" : "h2"} align="center">{title}</Text>
        ) : (
          title
        )}
      </View>
      <View style={styles.sideRight}>{right ? <Button variant="ghost" size="small" onPress={right.onPress} icon={right.icon}>{right.label}</Button> : <View />}</View>
    </View>
  );
};

const createStyles = (
  theme: ReturnType<typeof useTheme>['theme'],
  insets: ReturnType<typeof useSafeAreaInsets>,
  compact: boolean,
) =>
  StyleSheet.create({
    container: {
      paddingTop: Math.max(insets.top, compact ? theme.spacing[4] : theme.spacing[6]),
      paddingHorizontal: theme.layout.screenPadding,
      paddingBottom: compact ? theme.spacing[2] : theme.spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sideLeft: {
      width: 80,
      alignItems: 'flex-start',
    },
    titleWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideRight: {
      width: 80,
      alignItems: 'flex-end',
    },
  });

export default AppHeader;
