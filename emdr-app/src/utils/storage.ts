import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLSSettings, DEFAULT_SETTINGS, SessionHistory, SessionSummary, SessionStats } from '../types';

const SETTINGS_KEY = '@emdr_settings';
const HISTORY_KEY = '@emdr_session_history';
const DEMO_DATA_KEY = '@emdr_demo_data_loaded';

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
    await AsyncStorage.removeItem(DEMO_DATA_KEY);
  } catch (error) {
    console.error('Error clearing session history:', error);
  }
};

// Generate sample demo data for first-time users
const generateDemoData = (): SessionHistory[] => {
  const now = Date.now();
  const daysInMs = 24 * 60 * 60 * 1000;

  const demoGoals = [
    'Release anxiety about upcoming presentation',
    'Process feelings from difficult conversation',
    'Let go of worry about future',
    'Find peace with past decisions',
    'Reduce stress from work deadlines',
    'Heal from recent loss',
    'Build confidence for new challenges',
  ];

  return [
    // Session 1 - 2 hours ago (recent success)
    {
      id: 'demo_session_1',
      summary: {
        preSUD: { value: 7, timestamp: now - 2 * 60 * 60 * 1000, type: 'pre' },
        postSUD: { value: 3, timestamp: now - 2 * 60 * 60 * 1000, type: 'post' },
        midSUDs: [
          { value: 6, timestamp: now - 2 * 60 * 60 * 1000, type: 'mid' },
          { value: 5, timestamp: now - 2 * 60 * 60 * 1000, type: 'mid' },
          { value: 4, timestamp: now - 2 * 60 * 60 * 1000, type: 'mid' },
        ],
        totalDuration: 420, // 7 minutes
        totalSets: 6,
        completedAt: now - 2 * 60 * 60 * 1000,
        goal: demoGoals[0],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 2 - 1 day ago
    {
      id: 'demo_session_2',
      summary: {
        preSUD: { value: 8, timestamp: now - 1 * daysInMs, type: 'pre' },
        postSUD: { value: 4, timestamp: now - 1 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 7, timestamp: now - 1 * daysInMs, type: 'mid' },
          { value: 6, timestamp: now - 1 * daysInMs, type: 'mid' },
        ],
        totalDuration: 360,
        totalSets: 5,
        completedAt: now - 1 * daysInMs,
        goal: demoGoals[1],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 3 - 3 days ago
    {
      id: 'demo_session_3',
      summary: {
        preSUD: { value: 6, timestamp: now - 3 * daysInMs, type: 'pre' },
        postSUD: { value: 2, timestamp: now - 3 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 5, timestamp: now - 3 * daysInMs, type: 'mid' },
          { value: 4, timestamp: now - 3 * daysInMs, type: 'mid' },
          { value: 3, timestamp: now - 3 * daysInMs, type: 'mid' },
        ],
        totalDuration: 480,
        totalSets: 7,
        completedAt: now - 3 * daysInMs,
        goal: demoGoals[2],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 4 - 5 days ago
    {
      id: 'demo_session_4',
      summary: {
        preSUD: { value: 9, timestamp: now - 5 * daysInMs, type: 'pre' },
        postSUD: { value: 5, timestamp: now - 5 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 8, timestamp: now - 5 * daysInMs, type: 'mid' },
          { value: 7, timestamp: now - 5 * daysInMs, type: 'mid' },
          { value: 6, timestamp: now - 5 * daysInMs, type: 'mid' },
        ],
        totalDuration: 540,
        totalSets: 8,
        completedAt: now - 5 * daysInMs,
        goal: demoGoals[3],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 5 - 7 days ago
    {
      id: 'demo_session_5',
      summary: {
        preSUD: { value: 7, timestamp: now - 7 * daysInMs, type: 'pre' },
        postSUD: { value: 3, timestamp: now - 7 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 6, timestamp: now - 7 * daysInMs, type: 'mid' },
          { value: 5, timestamp: now - 7 * daysInMs, type: 'mid' },
        ],
        totalDuration: 400,
        totalSets: 6,
        completedAt: now - 7 * daysInMs,
        goal: demoGoals[4],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 6 - 10 days ago
    {
      id: 'demo_session_6',
      summary: {
        preSUD: { value: 5, timestamp: now - 10 * daysInMs, type: 'pre' },
        postSUD: { value: 2, timestamp: now - 10 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 4, timestamp: now - 10 * daysInMs, type: 'mid' },
          { value: 3, timestamp: now - 10 * daysInMs, type: 'mid' },
        ],
        totalDuration: 320,
        totalSets: 5,
        completedAt: now - 10 * daysInMs,
        goal: demoGoals[5],
      },
      settings: DEFAULT_SETTINGS,
    },
    // Session 7 - 14 days ago
    {
      id: 'demo_session_7',
      summary: {
        preSUD: { value: 8, timestamp: now - 14 * daysInMs, type: 'pre' },
        postSUD: { value: 4, timestamp: now - 14 * daysInMs, type: 'post' },
        midSUDs: [
          { value: 7, timestamp: now - 14 * daysInMs, type: 'mid' },
          { value: 6, timestamp: now - 14 * daysInMs, type: 'mid' },
          { value: 5, timestamp: now - 14 * daysInMs, type: 'mid' },
        ],
        totalDuration: 450,
        totalSets: 7,
        completedAt: now - 14 * daysInMs,
        goal: demoGoals[6],
      },
      settings: DEFAULT_SETTINGS,
    },
  ];
};

// Load sample demo data on first launch
export const loadDemoDataIfNeeded = async (): Promise<void> => {
  try {
    const demoLoaded = await AsyncStorage.getItem(DEMO_DATA_KEY);
    const existingHistory = await loadSessionHistory();

    // Only load demo data if never loaded before AND no real sessions exist
    if (!demoLoaded && existingHistory.length === 0) {
      const demoData = generateDemoData();
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(demoData));
      await AsyncStorage.setItem(DEMO_DATA_KEY, 'true');
    }
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
};
