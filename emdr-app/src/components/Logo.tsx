import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useTheme } from '../theme';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 80 }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size,
          transform: [{ scale: pulseAnim }]
        }
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G>
          {/* Left flowing path */}
          <Path
            d="M 20 50 Q 30 30, 40 50 Q 30 70, 20 50"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.8}
          />

          {/* Right flowing path */}
          <Path
            d="M 80 50 Q 70 30, 60 50 Q 70 70, 80 50"
            fill="none"
            stroke={theme.colors.secondary}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.8}
          />

          {/* Center circle representing focus and centering */}
          <Circle
            cx="50"
            cy="50"
            r="8"
            fill={theme.colors.primary}
            opacity={0.9}
          />

          {/* Inner center circle for depth */}
          <Circle
            cx="50"
            cy="50"
            r="4"
            fill={theme.colors.secondary}
            opacity={0.7}
          />

          {/* Horizontal bilateral movement lines */}
          <Path
            d="M 15 50 L 35 50"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.5}
          />
          <Path
            d="M 65 50 L 85 50"
            stroke={theme.colors.secondary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* Subtle outer circle for containment */}
          <Circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="1"
            opacity={0.15}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
