import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { VisualStimulus } from '../components/VisualStimulus';
import { AudioEngine } from '../components/AudioEngine';
import { HapticEngine } from '../components/HapticEngine';
import { SessionTimer } from '../components/SessionTimer';
import { QuickSUDCheck } from '../components/QuickSUDCheck';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useBilateralStimulation, StimulationSide } from '../hooks/useBilateralStimulation';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { BLSSettings, SessionSummary, SUDRating } from '../types';
import { theme } from '../theme';

interface SessionScreenProps {
  settings: BLSSettings;
  preSUD: number;
  onSessionComplete: (summary: Omit<SessionSummary, 'postSUD'>) => void;
  onBack: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  settings,
  preSUD,
  onSessionComplete,
  onBack,
}) => {
  const [currentSide, setCurrentSide] = React.useState<StimulationSide>('left');
  const [midSUDs, setMidSUDs] = useState<SUDRating[]>([]);
  const [showSUDCheck, setShowSUDCheck] = useState(false);
  const [hasShownSUDForSet, setHasShownSUDForSet] = useState(false);

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

  const { currentSide: blsSide } = useBilateralStimulation({
    isActive: sessionState.isActive && !sessionState.isPaused && !sessionState.isResting,
    speed: settings.speed,
    onTrigger: handleTrigger,
  });

  useEffect(() => {
    setCurrentSide(blsSide);
  }, [blsSide]);

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
      // Unlock orientation and allow sleep when leaving
      ScreenOrientation.unlockAsync();
      deactivateKeepAwake();
    };
  }, []);

  useEffect(() => {
    // Auto-start session
    if (!sessionState.isActive && sessionState.currentSet === 0) {
      startSession();
    }
  }, []);

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

      {/* Quick SUD Check */}
      {showSUDCheck && (
        <QuickSUDCheck
          onSubmit={handleSUDSubmit}
          onSkip={handleSUDSkip}
          initialValue={midSUDs.length > 0 ? midSUDs[midSUDs.length - 1].value : preSUD}
        />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  header: {
    position: 'absolute',
    top: theme.spacing[5],
    left: theme.spacing[5],
    right: theme.spacing[5],
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: theme.colors.transparent,
  },
  stimulusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  controls: {
    position: 'absolute',
    bottom: theme.spacing[10],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    zIndex: 10,
  },
  controlButton: {
    minWidth: 140,
  },
});
