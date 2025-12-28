import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { PieChart, PieChartData } from '../components/PieChart';
import { BarChart, BarChartData } from '../components/BarChart';
import { SessionHistory, SessionStats } from '../types';
import { loadSessionHistory, calculateStats } from '../utils/storage';
import { useTheme, getSUDColor, getSUDEmoji } from '../theme';

interface StatsScreenProps {
  onClose: () => void;
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const StatsScreen: React.FC<StatsScreenProps> = ({ onClose }) => {
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sessionHistory = await loadSessionHistory();
    setHistory(sessionHistory);
    setStats(calculateStats(sessionHistory));
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h2">Your Progress</Text>
          <Button variant="ghost" size="small" onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </Button>
        </View>
        <View style={styles.loadingContainer}>
          <Text variant="body" color="textSecondary">
            Loading your stats...
          </Text>
        </View>
      </View>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h2">Your Progress</Text>
          <Button variant="ghost" size="small" onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </Button>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={64} color={theme.colors.textTertiary} />
          <Text variant="h4" color="textSecondary" style={styles.emptyTitle}>
            No Sessions Yet
          </Text>
          <Text variant="body" color="textTertiary" align="center" style={styles.emptyText}>
            Complete your first therapy session to start tracking your progress and healing journey.
          </Text>
          <Button size="large" onPress={onClose} style={styles.emptyButton}>
            Start Your First Session
          </Button>
        </View>
      </View>
    );
  }

  // Prepare chart data
  const successRateData: PieChartData[] = [
    {
      label: 'Improved',
      value: stats.successRate,
      color: theme.colors.success,
    },
    {
      label: 'No Change/Worse',
      value: 100 - stats.successRate,
      color: theme.colors.textTertiary,
    },
  ];

  // Recent sessions for bar chart (last 7 sessions)
  const recentSessions = history.slice(0, 7).reverse();
  const sessionsBarData: BarChartData[] = recentSessions.map((session, index) => {
    const improvement = session.summary.preSUD.value - session.summary.postSUD.value;
    return {
      label: `S${recentSessions.length - index}`,
      value: improvement,
      color: improvement >= 0 ? theme.colors.success : theme.colors.error,
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, theme.spacing[8]), paddingBottom: Math.max(insets.bottom, theme.spacing[8]) }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Your Progress</Text>
          <Button variant="ghost" size="small" onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </Button>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="calendar-outline" size={32} color={theme.colors.primary} />
            <Text variant="display" color="primary">
              {stats.totalSessions}
            </Text>
            <Text variant="caption" color="textSecondary">
              Total Sessions
            </Text>
          </Card>

          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color={theme.colors.secondary} />
            <Text variant="display" color="secondary">
              {formatDuration(stats.totalDuration)}
            </Text>
            <Text variant="caption" color="textSecondary">
              Total Time
            </Text>
          </Card>
        </View>

        {/* Success Rate Pie Chart */}
        <Card variant="elevated" style={styles.chartCard}>
          <PieChart
            data={successRateData}
            title="Success Rate"
            centerValue={`${Math.round(stats.successRate)}%`}
            centerLabel="Improved"
            size={220}
          />
        </Card>

        {/* Average Improvement */}
        <Card variant="elevated" style={styles.improvementCard}>
          <View style={styles.improvementHeader}>
            <Ionicons
              name="trending-down-outline"
              size={40}
              color={
                stats.averageSUDImprovement >= 0 ? theme.colors.success : theme.colors.error
              }
            />
            <View style={styles.improvementText}>
              <Text variant="h1" color={stats.averageSUDImprovement >= 0 ? 'success' : 'error'}>
                {stats.averageSUDImprovement >= 0 ? '-' : '+'}
                {Math.abs(stats.averageSUDImprovement).toFixed(1)}
              </Text>
              <Text variant="caption" color="textSecondary">
                Average SUD Reduction per Session
              </Text>
            </View>
          </View>
          <Text variant="bodySmall" color="textTertiary" style={styles.improvementNote}>
            {stats.averageSUDImprovement >= 0
              ? 'You\'re making great progress! Keep going.'
              : 'Some sessions may feel harder, but healing isn\'t linear.'}
          </Text>
        </Card>

        {/* Recent Sessions Bar Chart */}
        {recentSessions.length > 0 && (
          <Card variant="elevated" style={styles.chartCard}>
            <BarChart
              data={sessionsBarData}
              title="Recent Progress (SUD Change)"
              width={340}
              height={220}
              maxValue={10}
              showValues={true}
            />
            <Text variant="caption" color="textTertiary" align="center" style={styles.chartNote}>
              Positive values show improvement (SUD decreased)
            </Text>
          </Card>
        )}

        {/* Recent Sessions List */}
        <View style={styles.historySection}>
          <Text variant="h4" style={styles.sectionTitle}>
            Recent Sessions
          </Text>
          {history.slice(0, 5).map((session, index) => {
            const improvement = session.summary.preSUD.value - session.summary.postSUD.value;
            const improved = improvement > 0;

            return (
              <Card key={session.id} variant="elevated" style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionDate}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.textTertiary} />
                    <Text variant="caption" color="textTertiary">
                      {formatDate(session.summary.completedAt)}
                    </Text>
                  </View>
                  <Text variant="caption" color="textTertiary">
                    {formatDuration(session.summary.totalDuration)} •{' '}
                    {session.summary.totalSets} sets
                  </Text>
                </View>

                <View style={styles.sessionStats}>
                  <View style={styles.sudChange}>
                    <Text variant="caption" color="textSecondary">
                      SUD
                    </Text>
                    <View style={styles.sudValues}>
                      <Text variant="h4">{getSUDEmoji(session.summary.preSUD.value)}</Text>
                      <Text variant="h3" color="textPrimary">
                        {session.summary.preSUD.value}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sudArrow}>
                    <Ionicons
                      name={improved ? 'arrow-forward' : 'arrow-forward'}
                      size={24}
                      color={improved ? theme.colors.success : theme.colors.textTertiary}
                    />
                  </View>

                  <View style={styles.sudChange}>
                    <Text variant="caption" color="textSecondary">
                      After
                    </Text>
                    <View style={styles.sudValues}>
                      <Text variant="h4">{getSUDEmoji(session.summary.postSUD.value)}</Text>
                      <Text variant="h3" color="textPrimary">
                        {session.summary.postSUD.value}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sudImprovement}>
                    <Text
                      variant="h3"
                      color={improved ? 'success' : 'textTertiary'}
                      style={styles.improvementValue}
                    >
                      {improved ? '-' : '+'}
                      {Math.abs(improvement)}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    paddingBottom: theme.spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing[4],
  },
  emptyTitle: {
    marginTop: theme.spacing[4],
  },
  emptyText: {
    maxWidth: 300,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: theme.spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  statCard: {
    flex: 1,
    padding: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  chartCard: {
    marginHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing[6],
    padding: theme.spacing[6],
  },
  chartNote: {
    marginTop: theme.spacing[4],
  },
  improvementCard: {
    marginHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing[6],
    padding: theme.spacing[6],
  },
  improvementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  improvementText: {
    flex: 1,
    gap: theme.spacing[1],
  },
  improvementNote: {
    lineHeight: 20,
  },
  historySection: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  sessionCard: {
    padding: theme.spacing[5],
    marginBottom: theme.spacing[3],
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  sessionDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  sessionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sudChange: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  sudValues: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  sudArrow: {
    marginHorizontal: theme.spacing[3],
  },
  sudImprovement: {
    minWidth: 60,
    alignItems: 'center',
  },
  improvementValue: {
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: theme.spacing[8],
  },
});
