import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SUDSlider } from '../components/SUDSlider';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { AppHeader } from '../components/ui/AppHeader';
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: theme.spacing[4],
            paddingLeft: Math.max(insets.left, theme.layout.screenPadding),
            paddingRight: Math.max(insets.right, theme.layout.screenPadding),
          },
        ]}
      >
        <AppHeader title="Rate Your Distress" left={{ onPress: onBack, icon: <Ionicons name="arrow-back" size={18} color={theme.colors.primary} /> }} compact />

        <View style={styles.mainContentTop}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="heart" size={28} color={theme.colors.primary} />
            </View>
            <Text variant="h3" align="center" style={styles.title}>
              Rate Your Distress
            </Text>
            <Text variant="bodySmall" color="textSecondary" align="center" style={styles.description}>
              How distressing does this feel?
            </Text>
          </View>

          <View style={styles.goalReminder}>
            <Text variant="caption" color="textTertiary" align="center">
              YOUR FOCUS
            </Text>
            <Text variant="body" color="textPrimary" align="center" style={styles.goalText}>
              "{goal}"
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <SUDSlider value={sudValue} onChange={setSudValue} showLabels={false} showTitle={false} />
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[4]), paddingHorizontal: Math.max(insets.left, theme.layout.screenPadding) }]}>
        <View style={styles.buttonContainer}>
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
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    mainContentTop: {
      flex: 1,
    },
    titleContainer: {
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: theme.spacing[1],
    },
    description: {
      lineHeight: 20,
    },
    goalReminder: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[4],
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },
    goalText: {
      fontStyle: 'italic',
      lineHeight: 22,
    },
    sliderContainer: {
      paddingVertical: theme.spacing[4],
    },
    buttonContainer: {
      paddingTop: theme.spacing[2],
    },
    footer: {
      backgroundColor: 'transparent',
    },
  });
