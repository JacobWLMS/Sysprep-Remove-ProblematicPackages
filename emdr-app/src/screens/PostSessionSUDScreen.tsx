import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SUDSlider } from '../components/SUDSlider';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { SessionSummary } from '../types';
import { useTheme, getSUDEmoji } from '../theme';

interface PostSessionSUDScreenProps {
  partialSummary: Omit<SessionSummary, 'postSUD'>;
  goal?: string;
  onContinue: (summary: SessionSummary) => void;
}

export const PostSessionSUDScreen: React.FC<PostSessionSUDScreenProps> = ({
  partialSummary,
  goal,
  onContinue,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [sudValue, setSudValue] = useState(5);

  const handleContinue = () => {
    const summary: SessionSummary = {
      ...partialSummary,
      postSUD: {
        value: sudValue,
        timestamp: Date.now(),
        type: 'post',
      },
    };
    onContinue(summary);
  };

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
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} style={styles.icon} />
          <Text variant="h2" align="center" style={styles.title}>
            Session Complete
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.description}>
            How do you feel now? Rate your current level of distress.
          </Text>
        </View>

        <Card variant="elevated" style={styles.comparisonCard}>
          <Text variant="caption" color="textSecondary" align="center">
            Your initial rating was
          </Text>
          <View style={styles.comparisonValue}>
            <Text style={styles.comparisonEmoji}>{getSUDEmoji(partialSummary.preSUD.value)}</Text>
            <Text variant="h1" style={{ color: theme.colors.primary }}>
              {partialSummary.preSUD.value}
            </Text>
          </View>
        </Card>

        <View style={styles.sliderContainer}>
          <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} showTitle={false} />
        </View>

        <Button
          size="large"
          fullWidth
          onPress={handleContinue}
          icon={<Ionicons name="analytics" size={24} color={theme.colors.white} />}
        >
          View Summary
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
    mainContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    titleContainer: {
      marginTop: theme.spacing[6],
      alignItems: 'center',
    },
    icon: {
      marginBottom: theme.spacing[4],
    },
    title: {
      marginBottom: theme.spacing[4],
    },
    description: {
      lineHeight: 24,
    },
    comparisonCard: {
      alignItems: 'center',
      paddingVertical: theme.spacing[5],
    },
    comparisonValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    comparisonEmoji: {
      fontSize: 48,
    },
    sliderContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: theme.spacing[6],
    },
  });
