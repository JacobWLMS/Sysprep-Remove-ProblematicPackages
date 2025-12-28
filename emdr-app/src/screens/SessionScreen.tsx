import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { VisualStimulus } from '../components/VisualStimulus';
import { AudioEngine } from '../components/AudioEngine';
import { HapticEngine } from '../components/HapticEngine';
import { SessionTimer } from '../components/SessionTimer';
import { useBilateralStimulation, StimulationSide } from '../hooks/useBilateralStimulation';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { BLSSettings, SessionSummary } from '../types';

interface SessionScreenProps {
  settings: BLSSettings;
  preSUD: number;
  onSessionComplete: (summary: SessionSummary) => void;
  onBack: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  settings,
  preSUD,
  onSessionComplete,
  onBack,
}) => {
  const [currentSide, setCurrentSide] = React.useState<StimulationSide>('left');

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

  const handleStop = () => {
    stopSession();
    // Navigate to post-session SUD rating
    // For now, we'll just call onSessionComplete with a placeholder
    const summary: SessionSummary = {
      preSUD: { value: preSUD, timestamp: Date.now(), type: 'pre' },
      postSUD: { value: 5, timestamp: Date.now(), type: 'post' }, // Will be set later
      midSUDs: [],
      totalDuration: sessionState.elapsedSessionTime,
      totalSets: sessionState.currentSet,
      completedAt: Date.now(),
    };
    onSessionComplete(summary);
  };

  const handleScreenPress = () => {
    if (!sessionState.isActive) return;
    handleTogglePause();
  };

  return (
    <Pressable style={styles.container} onPress={handleScreenPress}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        {sessionState.isPaused && (
          <Text style={styles.pausedText}>PAUSED</Text>
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

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={handleTogglePause}
        >
          <Text style={styles.buttonText}>
            {sessionState.isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStop}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  pausedText: {
    fontSize: 18,
    color: '#FFD600',
    fontWeight: 'bold',
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
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: 'rgba(0, 168, 232, 0.8)',
  },
  stopButton: {
    backgroundColor: 'rgba(255, 87, 34, 0.8)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
