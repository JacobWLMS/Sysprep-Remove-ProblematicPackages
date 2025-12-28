import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SessionSummary } from '../types';
import { SUDGraph } from '../components/SUDGraph';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { theme, getSUDEmoji } from '../theme';

interface SummaryScreenProps {
  summary: SessionSummary;
  onDone: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  summary,
  onDone,
}) => {
  const sudChange = summary.postSUD.value - summary.preSUD.value;
  const sudImproved = sudChange < 0;
  const sudChangeAbs = Math.abs(sudChange);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Success Animation */}
        <View style={styles.header}>
          <Text variant="h2" align="center" style={styles.title}>
            Session Complete
          </Text>
          <Animated.View
            style={[
              styles.checkmark,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          </Animated.View>
        </View>

        {/* SUD Graph */}
        <Card variant="elevated" style={styles.graphCard}>
          <SUDGraph
            preSUD={summary.preSUD}
            postSUD={summary.postSUD}
            midSUDs={summary.midSUDs}
          />
        </Card>

        {/* Session Stats */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color={theme.colors.primary} />
            <Text variant="h4" style={styles.statValue}>
              {formatDuration(summary.totalDuration)}
            </Text>
            <Text variant="caption" color="textSecondary">
              Duration
            </Text>
          </Card>

          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="repeat-outline" size={32} color={theme.colors.primary} />
            <Text variant="h4" style={styles.statValue}>
              {summary.totalSets}
            </Text>
            <Text variant="caption" color="textSecondary">
              Sets Completed
            </Text>
          </Card>
        </View>

        {/* Mid-Session Ratings */}
        {summary.midSUDs.length > 0 && (
          <View style={styles.section}>
            <Text variant="h5" style={styles.sectionTitle}>
              Progress During Session
            </Text>
            <View style={styles.midSudsList}>
              {summary.midSUDs.map((sud, index) => (
                <Card key={index} variant="default" style={styles.midSudItem}>
                  <View style={styles.midSudLeft}>
                    <Text style={styles.midSudEmoji}>{getSUDEmoji(sud.value)}</Text>
                    <Text variant="label" color="textSecondary">
                      After Set {index + 1}
                    </Text>
                  </View>
                  <Text variant="h4" style={{ color: theme.colors.primary }}>
                    {sud.value}
                  </Text>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* Encouragement Note */}
        <Card variant="default" style={styles.noteCard}>
          <Ionicons name="bulb-outline" size={24} color={theme.colors.warning} style={styles.noteIcon} />
          <Text variant="body" color="textSecondary" align="center">
            Remember to discuss this session with your therapist. Your progress is important.
          </Text>
        </Card>

        {/* Done Button */}
        <Button
          onPress={onDone}
          size="large"
          fullWidth
          icon={<Ionicons name="home" size={24} color={theme.colors.white} />}
        >
          Return Home
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing[12],
    paddingBottom: theme.spacing[10],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  title: {
    marginBottom: theme.spacing[6],
  },
  checkmark: {
    marginBottom: theme.spacing[4],
  },
  graphCard: {
    marginBottom: theme.spacing[6],
    padding: theme.spacing[5],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing[5],
  },
  statValue: {
    marginVertical: theme.spacing[2],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  midSudsList: {
    gap: theme.spacing[3],
  },
  midSudItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  midSudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  midSudEmoji: {
    fontSize: 32,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.primary10,
    marginBottom: theme.spacing[6],
    gap: theme.spacing[3],
  },
  noteIcon: {
    marginRight: theme.spacing[2],
  },
});
