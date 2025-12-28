import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface VisualStimulusProps {
  isActive: boolean;
  speed: number; // Hz (cycles per second)
  dotColor: string;
  dotSize: number;
}

const HORIZONTAL_PADDING = 40;

export const VisualStimulus: React.FC<VisualStimulusProps> = ({
  isActive,
  speed,
  dotColor,
  dotSize,
}) => {
  const { width } = useWindowDimensions();
  const position = useSharedValue(0);

  // Calculate the full cycle duration in milliseconds
  // At 1.0 Hz: 1 complete left-right-left cycle per second = 1000ms
  // At 0.5 Hz: 1 cycle takes 2000ms
  // At 1.8 Hz: 1 cycle takes ~555ms
  const cycleDuration = 1000 / speed;

  // Half cycle (left to right OR right to left)
  const halfCycleDuration = cycleDuration / 2;

  const maxPosition = width - (HORIZONTAL_PADDING * 2) - dotSize;

  useEffect(() => {
    if (isActive) {
      // Start animation from current position
      position.value = withRepeat(
        withSequence(
          // Move from left (0) to right (maxPosition)
          withTiming(maxPosition, {
            duration: halfCycleDuration,
            easing: Easing.inOut(Easing.ease),
          }),
          // Move from right back to left
          withTiming(0, {
            duration: halfCycleDuration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Infinite repeat
        false // Don't reverse (we're using sequence)
      );
    } else {
      // Stop animation but keep position
      cancelAnimation(position);
      // Reset to center
      position.value = withTiming(maxPosition / 2, { duration: 300 });
    }
  }, [isActive, speed, maxPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: dotColor,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          left: HORIZONTAL_PADDING,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
