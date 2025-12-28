import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SUDSlider } from '../components/SUDSlider';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useTheme } from '../theme';

interface SUDRatingScreenProps {
  goal: string;
  onContinue: (sudValue: number) => void;
  onBack: () => void;
}

export const SUDRatingScreen: React.FC<SUDRatingScreenProps> = ({
  goal,
  onContinue,
  onBack,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [sudValue, setSudValue] = useState(5);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, theme.spacing[5]),
          paddingBottom: Math.max(insets.bottom, theme.spacing[5]),
          paddingLeft: Math.max(insets.left, theme.layout.screenPadding),
          paddingRight: Math.max(insets.right, theme.layout.screenPadding),
        },
      ]}
    >
      <Button
        variant="ghost"
        size="small"
        onPress={onBack}
        icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
        style={styles.backButton}
      >
        <Text variant="label" color="primary">
          Back
        </Text>
      </Button>

      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name="heart" size={32} color={theme.colors.primary} />
          </View>
          <Text variant="h2" align="center" style={styles.title}>
            Rate Your Distress
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.description}>
            How distressing does this feel right now?
          </Text>
        </View>

        <View style={styles.goalReminder}>
          <Text variant="caption" color="textTertiary" align="center">
            YOUR FOCUS
          </Text>
          <Text variant="bodyLarge" color="textPrimary" align="center" style={styles.goalText}>
            "{goal}"
          </Text>
        </View>

        <View style={styles.sliderContainer}>
          <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} />
        </View>

        <View style={styles.spacer} />

        <Button
          size="large"
          fullWidth
          onPress={() => onContinue(sudValue)}
          icon={<Ionicons name="play-circle" size={24} color={theme.colors.white} />}
        >
          Begin Healing
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: theme.spacing[4],
    },
    mainContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    titleContainer: {
      alignItems: 'center',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[6],
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: theme.spacing[2],
    },
    description: {
      lineHeight: 24,
    },
    goalReminder: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[5],
      gap: theme.spacing[2],
    },
    goalText: {
      fontStyle: 'italic',
      lineHeight: 26,
    },
    sliderContainer: {
      paddingVertical: theme.spacing[6],
    },
    spacer: {
      flex: 1,
    },
  });
