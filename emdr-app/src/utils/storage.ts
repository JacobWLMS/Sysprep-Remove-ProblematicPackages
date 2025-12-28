import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLSSettings, DEFAULT_SETTINGS, SessionHistory, SessionSummary, SessionStats } from '../types';

const SETTINGS_KEY = '@emdr_settings';
const HISTORY_KEY = '@emdr_session_history';

export const saveSettings = async (settings: BLSSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<BLSSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const clearSettings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
};

// Session History functions
export const saveSessionHistory = async (
  summary: SessionSummary,
  settings: BLSSettings
): Promise<void> => {
  try {
    const history = await loadSessionHistory();
    const newSession: SessionHistory = {
      id: `session_${Date.now()}`,
      summary,
      settings,
    };
    history.unshift(newSession); // Add to beginning (most recent first)

    // Keep only last 100 sessions to avoid storage issues
    const trimmedHistory = history.slice(0, 100);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving session history:', error);
  }
};

export const loadSessionHistory = async (): Promise<SessionHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
  } catch (error) {
    console.error('Error loading session history:', error);
  }
  return [];
};

export const calculateStats = (history: SessionHistory[]): SessionStats => {
  if (history.length === 0) {
    return {
      totalSessions: 0,
      averageSUDImprovement: 0,
      successRate: 0,
      totalDuration: 0,
      averageSessionDuration: 0,
      sudDistribution: {},
    };
  }

  const totalSessions = history.length;
  let totalImprovement = 0;
  let successfulSessions = 0;
  let totalDuration = 0;
  const sudDistribution: { [key: number]: number } = {};

  // Initialize SUD distribution
  for (let i = 0; i <= 10; i++) {
    sudDistribution[i] = 0;
  }

  history.forEach((session) => {
    const improvement = session.summary.preSUD.value - session.summary.postSUD.value;
    totalImprovement += improvement;

    if (improvement > 0) {
      successfulSessions++;
    }

    totalDuration += session.summary.totalDuration;

    // Track pre and post SUD distribution
    sudDistribution[session.summary.preSUD.value]++;
    sudDistribution[session.summary.postSUD.value]++;
  });

  return {
    totalSessions,
    averageSUDImprovement: totalImprovement / totalSessions,
    successRate: (successfulSessions / totalSessions) * 100,
    totalDuration,
    averageSessionDuration: totalDuration / totalSessions,
    mostRecentSession: history[0],
    sudDistribution,
  };
};

export const clearSessionHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing session history:', error);
  }
};
