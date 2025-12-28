export interface BLSSettings {
  // Modality toggles
  visualEnabled: boolean;
  audioEnabled: boolean;
  hapticEnabled: boolean;

  // Speed (Hz)
  speed: number; // 0.5 - 1.8 Hz

  // Visual settings
  dotColor: string;
  dotSize: number;

  // Audio settings
  audioVolume: number; // 0-1

  // Haptic settings
  hapticIntensity: 'Light' | 'Medium' | 'Heavy';

  // Session settings
  setDuration: number; // seconds
  restInterval: number; // seconds
  maxSets: number;
  maxSessionDuration: number; // minutes
}

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  isResting: boolean;
  currentSet: number;
  totalSets: number;
  sessionStartTime: number | null;
  setStartTime: number | null;
  restStartTime: number | null;
  elapsedSessionTime: number; // seconds
  elapsedSetTime: number; // seconds
  remainingRestTime: number; // seconds
}

export interface SUDRating {
  value: number; // 0-10
  timestamp: number;
  type: 'pre' | 'mid' | 'post';
}

export interface SessionSummary {
  preSUD: SUDRating;
  postSUD: SUDRating;
  midSUDs: SUDRating[];
  totalDuration: number; // seconds
  totalSets: number;
  completedAt: number;
  goal?: string; // Optional goal/intention for the session
}

export interface SessionHistory {
  id: string; // unique ID for each session
  summary: SessionSummary;
  settings: BLSSettings; // Settings used for this session
  goal?: string; // Session goal/intention
}

export interface SessionStats {
  totalSessions: number;
  averageSUDImprovement: number;
  successRate: number; // Percentage of sessions with SUD improvement
  totalDuration: number; // Total therapy time in seconds
  averageSessionDuration: number;
  mostRecentSession?: SessionHistory;
  sudDistribution: { [key: number]: number }; // Count of each SUD level (0-10)
}

export const DEFAULT_SETTINGS: BLSSettings = {
  visualEnabled: true,
  audioEnabled: true,
  hapticEnabled: true,
  speed: 1.0,
  dotColor: '#00A8E8',
  dotSize: 50,
  audioVolume: 0.7,
  hapticIntensity: 'Medium',
  setDuration: 24,
  restInterval: 10,
  maxSets: 30,
  maxSessionDuration: 20,
};

export const DOT_COLORS = [
  { name: 'Blue', value: '#00A8E8' },
  { name: 'Green', value: '#00C853' },
  { name: 'Purple', value: '#9C27B0' },
  { name: 'Orange', value: '#FF6F00' },
  { name: 'Cyan', value: '#00E5FF' },
  { name: 'Pink', value: '#F50057' },
  { name: 'Yellow', value: '#FFD600' },
  { name: 'White', value: '#FFFFFF' },
];
