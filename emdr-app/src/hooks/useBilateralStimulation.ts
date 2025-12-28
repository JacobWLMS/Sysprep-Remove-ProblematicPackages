import { useEffect, useRef, useState } from 'react';

export type StimulationSide = 'left' | 'right';

interface UseBilateralStimulationProps {
  isActive: boolean;
  speed: number; // Hz
  onTrigger: (side: StimulationSide) => void;
}

export const useBilateralStimulation = ({
  isActive,
  speed,
  onTrigger,
}: UseBilateralStimulationProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSide, setCurrentSide] = useState<StimulationSide>('left');

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Calculate interval: at 1.0 Hz, we want one complete cycle (left-right-left) per second
    // So we trigger left, then right, at half-cycle intervals
    // At 1.0 Hz: trigger every 500ms (left at 0ms, right at 500ms, left at 1000ms, etc.)
    const cycleDuration = 1000 / speed; // Full cycle duration in ms
    const triggerInterval = cycleDuration / 2; // Half cycle for alternation

    let side: StimulationSide = 'left';

    // Trigger immediately on start
    onTrigger(side);
    setCurrentSide(side);

    intervalRef.current = setInterval(() => {
      // Alternate sides
      side = side === 'left' ? 'right' : 'left';
      setCurrentSide(side);
      onTrigger(side);
    }, triggerInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, speed, onTrigger]);

  return { currentSide };
};
