import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { StimulationSide } from '../hooks/useBilateralStimulation';

interface HapticEngineProps {
  enabled: boolean;
  side: StimulationSide;
  intensity: 'Light' | 'Medium' | 'Heavy';
}

const intensityMap = {
  Light: Haptics.ImpactFeedbackStyle.Light,
  Medium: Haptics.ImpactFeedbackStyle.Medium,
  Heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export const HapticEngine: React.FC<HapticEngineProps> = ({
  enabled,
  side,
  intensity,
}) => {
  useEffect(() => {
    if (!enabled) return;

    const triggerHaptic = async () => {
      try {
        // Create perceptual difference between left and right
        // Left: use the configured intensity
        // Right: use one level higher (or same if already at Heavy)
        let feedbackStyle = intensityMap[intensity];

        if (side === 'right') {
          // Upgrade intensity for right side to create distinction
          if (intensity === 'Light') {
            feedbackStyle = Haptics.ImpactFeedbackStyle.Medium;
          } else if (intensity === 'Medium') {
            feedbackStyle = Haptics.ImpactFeedbackStyle.Heavy;
          }
        }

        await Haptics.impactAsync(feedbackStyle);
      } catch (error) {
        // Haptics not available on this device, fail silently
        console.log('Haptics not available:', error);
      }
    };

    triggerHaptic();
  }, [enabled, side, intensity]);

  return null; // This component doesn't render anything
};
