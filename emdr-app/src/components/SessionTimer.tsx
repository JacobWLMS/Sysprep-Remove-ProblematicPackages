import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SessionState } from '../types';

interface SessionTimerProps {
  sessionState: SessionState;
  setDuration: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const SessionTimer: React.FC<SessionTimerProps> = ({
  sessionState,
  setDuration,
}) => {
  const { width } = useWindowDimensions();
  const scale = Math.min(1, Math.max(0.8, width / 420));
  const { currentSet, elapsedSessionTime, elapsedSetTime, isResting, remainingRestTime } =
    sessionState;

  const setProgress = isResting ? 100 : (elapsedSetTime / setDuration) * 100;

  return (
    <View style={[styles.container, { padding: Math.round(16 * scale) }]}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { fontSize: Math.round(12 * scale) }]}>Set</Text>
          <Text style={[styles.infoValue, { fontSize: Math.round(20 * scale) }]}>{currentSet}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { fontSize: Math.round(12 * scale) }]}>Session Time</Text>
          <Text style={[styles.infoValue, { fontSize: Math.round(20 * scale) }]}>{formatTime(elapsedSessionTime)}</Text>
        </View>
      </View>

      {isResting ? (
        <View style={styles.restContainer}>
          <Text style={[styles.restLabel, { fontSize: Math.round(14 * scale) }]}>Rest Period</Text>
          <Text style={[styles.restTime, { fontSize: Math.round(28 * scale) }]}>{remainingRestTime}s</Text>
        </View>
      ) : (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${setProgress}%` }]} />
          </View>
          <Text style={[styles.progressText, { fontSize: Math.round(12 * scale) }]}> 
            {elapsedSetTime}s / {setDuration}s
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00A8E8',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#999',
  },
  restContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  restTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD600',
  },
});
