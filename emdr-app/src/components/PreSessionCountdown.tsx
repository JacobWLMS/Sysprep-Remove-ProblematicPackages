import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './ui/Text';
import { useTheme } from '../theme';

interface PreSessionCountdownProps {
  onComplete: () => void;
  countdownSeconds?: number;
}

export const PreSessionCountdown: React.FC<PreSessionCountdownProps> = ({
  onComplete,
  countdownSeconds = 3,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [count, setCount] = useState(countdownSeconds);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Animate the current number
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 100 }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );

    if (count === 0) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="body" color="textSecondary" style={styles.label}>
          Starting in
        </Text>
        <Animated.View style={animatedStyle}>
          <Text
            variant="display"
            color="primary"
            style={styles.number}
          >
            {count === 0 ? 'Begin' : count}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background + 'F0', // 94% opacity
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      alignItems: 'center',
      gap: theme.spacing[4],
    },
    label: {
      fontSize: 18,
      marginBottom: theme.spacing[2],
    },
    number: {
      fontSize: 96,
      fontWeight: '700',
    },
  });
