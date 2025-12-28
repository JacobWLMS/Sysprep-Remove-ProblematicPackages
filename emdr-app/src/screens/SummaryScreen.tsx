import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SessionSummary } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

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

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0a0a0a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Session Complete</Text>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        </View>

        {/* SUD Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distress Level (SUD)</Text>

          <View style={styles.sudComparison}>
            <View style={styles.sudItem}>
              <Text style={styles.sudLabel}>Before</Text>
              <Text style={styles.sudValue}>{summary.preSUD.value}</Text>
            </View>

            <View style={styles.sudArrow}>
              <Text style={styles.sudArrowText}>→</Text>
            </View>

            <View style={styles.sudItem}>
              <Text style={styles.sudLabel}>After</Text>
              <Text style={styles.sudValue}>{summary.postSUD.value}</Text>
            </View>
          </View>

          <View style={styles.sudChangeContainer}>
            <Text
              style={[
                styles.sudChange,
                sudImproved ? styles.sudImproved : styles.sudWorsened,
              ]}
            >
              {sudImproved ? '↓' : '↑'} {sudChangeAbs} point{sudChangeAbs !== 1 ? 's' : ''}
            </Text>
            {sudImproved ? (
              <Text style={styles.sudChangeLabel}>Distress reduced</Text>
            ) : sudChange > 0 ? (
              <Text style={styles.sudChangeLabel}>Distress increased</Text>
            ) : (
              <Text style={styles.sudChangeLabel}>No change</Text>
            )}
          </View>
        </View>

        {/* Session Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(summary.totalDuration)}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets Completed</Text>
              <Text style={styles.statValue}>{summary.totalSets}</Text>
            </View>
          </View>
        </View>

        {/* Mid-session SUDs if any */}
        {summary.midSUDs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mid-Session Ratings</Text>
            <View style={styles.midSudsList}>
              {summary.midSUDs.map((sud, index) => (
                <View key={index} style={styles.midSudItem}>
                  <Text style={styles.midSudLabel}>Set {index + 1}</Text>
                  <Text style={styles.midSudValue}>{sud.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Remember to discuss this session with your therapist. Your progress is important.
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={onDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingVertical: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 48,
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  sudComparison: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  sudItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  sudLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  sudValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00A8E8',
  },
  sudArrow: {
    marginHorizontal: 20,
  },
  sudArrowText: {
    fontSize: 32,
    color: '#666',
  },
  sudChangeContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  sudChange: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sudImproved: {
    color: '#00C853',
  },
  sudWorsened: {
    color: '#FF6F00',
  },
  sudChangeLabel: {
    fontSize: 14,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  midSudsList: {
    gap: 12,
  },
  midSudItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
  },
  midSudLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  midSudValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A8E8',
  },
  noteContainer: {
    backgroundColor: 'rgba(0, 168, 232, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  noteText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#00A8E8',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
