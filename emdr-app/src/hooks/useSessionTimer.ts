import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionState } from '../types';

interface UseSessionTimerProps {
  setDuration: number; // seconds
  restInterval: number; // seconds
  maxSets: number;
  maxSessionDuration: number; // minutes
}

export const useSessionTimer = ({
  setDuration,
  restInterval,
  maxSets,
  maxSessionDuration,
}: UseSessionTimerProps) => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    isPaused: false,
    isResting: false,
    currentSet: 0,
    totalSets: 0,
    sessionStartTime: null,
    setStartTime: null,
    restStartTime: null,
    elapsedSessionTime: 0,
    elapsedSetTime: 0,
    remainingRestTime: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = useCallback(() => {
    const now = Date.now();
    setSessionState({
      isActive: true,
      isPaused: false,
      isResting: false,
      currentSet: 1,
      totalSets: 0,
      sessionStartTime: now,
      setStartTime: now,
      restStartTime: null,
      elapsedSessionTime: 0,
      elapsedSetTime: 0,
      remainingRestTime: 0,
    });
  }, []);

  const pauseSession = useCallback(() => {
    setSessionState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resumeSession = useCallback(() => {
    setSessionState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      totalSets: prev.currentSet,
    }));
  }, []);

  const startRest = useCallback(() => {
    setSessionState((prev) => ({
      ...prev,
      isResting: true,
      restStartTime: Date.now(),
      remainingRestTime: restInterval,
      setStartTime: null,
    }));
  }, [restInterval]);

  const startNextSet = useCallback(() => {
    setSessionState((prev) => ({
      ...prev,
      isResting: false,
      restStartTime: null,
      setStartTime: Date.now(),
      currentSet: prev.currentSet + 1,
      elapsedSetTime: 0,
      remainingRestTime: 0,
    }));
  }, []);

  useEffect(() => {
    if (!sessionState.isActive || sessionState.isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();

      setSessionState((prev) => {
        if (!prev.sessionStartTime) return prev;

        const elapsedSession = Math.floor((now - prev.sessionStartTime) / 1000);

        // Check if max session duration reached
        if (elapsedSession >= maxSessionDuration * 60) {
          stopSession();
          return prev;
        }

        // Check if max sets reached
        if (prev.currentSet >= maxSets && !prev.isResting) {
          stopSession();
          return prev;
        }

        if (prev.isResting && prev.restStartTime) {
          // In rest period
          const elapsedRest = Math.floor((now - prev.restStartTime) / 1000);
          const remaining = restInterval - elapsedRest;

          if (remaining <= 0) {
            // Rest period ended, start next set
            return {
              ...prev,
              isResting: false,
              restStartTime: null,
              setStartTime: now,
              currentSet: prev.currentSet + 1,
              elapsedSetTime: 0,
              remainingRestTime: 0,
              elapsedSessionTime: elapsedSession,
            };
          }

          return {
            ...prev,
            remainingRestTime: remaining,
            elapsedSessionTime: elapsedSession,
          };
        } else if (prev.setStartTime) {
          // In active set
          const elapsedSet = Math.floor((now - prev.setStartTime) / 1000);

          if (elapsedSet >= setDuration) {
            // Set completed, start rest period
            return {
              ...prev,
              isResting: true,
              restStartTime: now,
              setStartTime: null,
              remainingRestTime: restInterval,
              elapsedSessionTime: elapsedSession,
            };
          }

          return {
            ...prev,
            elapsedSetTime: elapsedSet,
            elapsedSessionTime: elapsedSession,
          };
        }

        return prev;
      });
    }, 100); // Update every 100ms for smooth countdown

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    sessionState.isActive,
    sessionState.isPaused,
    setDuration,
    restInterval,
    maxSets,
    maxSessionDuration,
    stopSession,
  ]);

  return {
    sessionState,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    startRest,
    startNextSet,
  };
};
