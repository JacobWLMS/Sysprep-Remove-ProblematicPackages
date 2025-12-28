import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { VisualStimulus } from '../components/VisualStimulus';
import { AudioEngine } from '../components/AudioEngine';
import { HapticEngine } from '../components/HapticEngine';
import { SessionTimer } from '../components/SessionTimer';
import { QuickSUDCheck } from '../components/QuickSUDCheck';
import { GoalReminder } from '../components/GoalReminder';
import { SessionInstructions } from '../components/SessionInstructions';
import { PreSessionCountdown } from '../components/PreSessionCountdown';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useBilateralStimulation, StimulationSide } from '../hooks/useBilateralStimulation';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { BLSSettings, SessionSummary, SUDRating } from '../types';
import { useTheme } from '../theme';

interface SessionScreenProps {
  settings: BLSSettings;
  preSUD: number;
  goal?: string;
  onSessionComplete: (summary: Omit<SessionSummary, 'postSUD'>) => void;
  onBack: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  settings,
  preSUD,
  goal,
  onSessionComplete,
  onBack,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(theme, insets), [theme, insets]);
  const [currentSide, setCurrentSide] = React.useState<StimulationSide>('left');
  const [midSUDs, setMidSUDs] = useState<SUDRating[]>([]);
  const [showSUDCheck, setShowSUDCheck] = useState(false);
  const [showGoalReminder, setShowGoalReminder] = useState(false);
  const [hasShownSUDForSet, setHasShownSUDForSet] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);

  const {
    sessionState,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  } = useSessionTimer({
    setDuration: settings.setDuration,
    restInterval: settings.restInterval,
    maxSets: settings.maxSets,
    maxSessionDuration: settings.maxSessionDuration,
  });

  const handleTrigger = useCallback((side: StimulationSide) => {
    setCurrentSide(side);
  }, []);

  // Only use the bilateral stimulation hook if visual is disabled
  // When visual is enabled, it will drive the timing via callbacks for perfect sync
  const { currentSide: blsSide } = useBilateralStimulation({
    isActive: !settings.visualEnabled && sessionState.isActive && !sessionState.isPaused && !sessionState.isResting,
    speed: settings.speed,
    onTrigger: handleTrigger,
  });

  useEffect(() => {
    // Only sync from hook if visual is disabled
    if (!settings.visualEnabled) {
      setCurrentSide(blsSide);
    }
  }, [blsSide, settings.visualEnabled]);

  // Show goal reminder during rest periods (if goal exists)
  useEffect(() => {
    if (goal && sessionState.isResting && sessionState.currentSet > 0 && sessionState.currentSet % 3 === 0) {
      // Show goal reminder 1 second into rest period, every 3rd set
      const timer = setTimeout(() => {
        setShowGoalReminder(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!sessionState.isResting) {
      setShowGoalReminder(false);
    }
  }, [sessionState.isResting, sessionState.currentSet, goal]);

  // Show quick SUD check during rest periods
  useEffect(() => {
    if (sessionState.isResting && sessionState.currentSet > 1 && !hasShownSUDForSet) {
      // Show SUD check 2 seconds into rest period
      const timer = setTimeout(() => {
        setShowSUDCheck(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!sessionState.isResting) {
      setHasShownSUDForSet(false);
    }
  }, [sessionState.isResting, sessionState.currentSet, hasShownSUDForSet]);

  useEffect(() => {
    // Lock orientation to landscape when session starts
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    // Keep screen awake during session
    activateKeepAwakeAsync();
    lockOrientation();

    return () => {
      // Explicitly lock back to portrait and allow sleep when leaving
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      deactivateKeepAwake();
    };
  }, []);

  const handleInstructionsContinue = () => {
    setShowInstructions(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    startSession();
  };

  const handleTogglePause = () => {
    if (sessionState.isPaused) {
      resumeSession();
    } else {
      pauseSession();
    }
  };

  const handleSUDSubmit = (value: number) => {
    const newSUD: SUDRating = {
      value,
      timestamp: Date.now(),
      type: 'mid',
    };
    setMidSUDs([...midSUDs, newSUD]);
    setShowSUDCheck(false);
    setHasShownSUDForSet(true);
  };

  const handleSUDSkip = () => {
    setShowSUDCheck(false);
    setHasShownSUDForSet(true);
  };

  const handleStop = () => {
    stopSession();
    const summary: Omit<SessionSummary, 'postSUD'> = {
      preSUD: { value: preSUD, timestamp: Date.now(), type: 'pre' },
      midSUDs,
      totalDuration: sessionState.elapsedSessionTime,
      totalSets: sessionState.currentSet,
      completedAt: Date.now(),
    };
    onSessionComplete(summary);
  };

  const handleScreenPress = () => {
    if (!sessionState.isActive || showSUDCheck) return;
    handleTogglePause();
  };

  return (
    <Pressable style={styles.container} onPress={handleScreenPress}>
      {/* Back Button */}
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="small"
          onPress={onBack}
          icon={<Ionicons name="arrow-back" size={20} color={theme.colors.textSecondary} />}
          style={styles.backButton}
        >
          <Text variant="label" color="textSecondary">Back</Text>
        </Button>
        {sessionState.isPaused && (
          <Text variant="h5" style={{ color: theme.colors.warning }}>
            PAUSED
          </Text>
        )}
      </View>

      {/* Visual Stimulus - Full Screen */}
      <View style={styles.stimulusContainer}>
        {settings.visualEnabled && (
          <VisualStimulus
            isActive={sessionState.isActive && !sessionState.isPaused && !sessionState.isResting}
            speed={settings.speed}
            dotColor={settings.dotColor}
            dotSize={settings.dotSize}
            onSideTrigger={handleTrigger}
          />
        )}
      </View>

      {/* Audio Engine - Invisible */}
      {settings.audioEnabled && (
        <AudioEngine
          enabled={sessionState.isActive && !sessionState.isPaused && !sessionState.isResting}
          side={currentSide}
          volume={settings.audioVolume}
        />
      )}

      {/* Haptic Engine - Invisible */}
      {settings.hapticEnabled && (
        <HapticEngine
          enabled={sessionState.isActive && !sessionState.isPaused && !sessionState.isResting}
          side={currentSide}
          intensity={settings.hapticIntensity}
        />
      )}

      {/* Session Info Overlay */}
      <View style={styles.overlay}>
        <SessionTimer
          sessionState={sessionState}
          setDuration={settings.setDuration}
        />
      </View>

      {/* Goal Reminder */}
      {showGoalReminder && goal && (
        <GoalReminder goal={goal} onDismiss={() => setShowGoalReminder(false)} />
      )}

      {/* Quick SUD Check */}
      {showSUDCheck && (
        <QuickSUDCheck
          onSubmit={handleSUDSubmit}
          onSkip={handleSUDSkip}
          initialValue={midSUDs.length > 0 ? midSUDs[midSUDs.length - 1].value : preSUD}
        />
      )}

      {/* Instructions Overlay */}
      {showInstructions && (
        <SessionInstructions
          onContinue={handleInstructionsContinue}
          settings={settings}
        />
      )}

      {/* Countdown Overlay */}
      {showCountdown && (
        <PreSessionCountdown onComplete={handleCountdownComplete} />
      )}

      {/* Control Buttons */}
      <View style={styles.controls}>
        <Button
          variant="outline"
          onPress={handleTogglePause}
          icon={
            <Ionicons
              name={sessionState.isPaused ? 'play' : 'pause'}
              size={20}
              color={theme.colors.primary}
            />
          }
          style={styles.controlButton}
        >
          {sessionState.isPaused ? 'Resume' : 'Pause'}
        </Button>

        <Button
          variant="primary"
          onPress={handleStop}
          icon={<Ionicons name="stop" size={20} color={theme.colors.white} />}
          style={[styles.controlButton, { backgroundColor: theme.colors.error }]}
        >
          Stop
        </Button>
      </View>
    </Pressable>
  );
};

const createStyles = (
  theme: ReturnType<typeof useTheme>['theme'],
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: 'absolute',
      // In landscape, use horizontal insets as top/left/right
      top: Math.max(insets.left, theme.spacing[3]),
      left: Math.max(insets.top, theme.spacing[3]),
      right: Math.max(insets.right, theme.spacing[3]),
      zIndex: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: theme.colors.transparent,
    },
    stimulusContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 100, // Leave space for controls at bottom
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      top: Math.max(insets.left, 60), // In landscape, left becomes top
      left: 0,
      right: 0,
      zIndex: 5,
    },
    controls: {
      position: 'absolute',
      // In landscape, use right inset as bottom
      bottom: Math.max(insets.right, theme.spacing[5]),
      left: Math.max(insets.top, theme.spacing[5]),
      right: Math.max(insets.bottom, theme.spacing[5]),
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing[4],
      zIndex: 10,
    },
    controlButton: {
      minWidth: 140,
    },
  });
