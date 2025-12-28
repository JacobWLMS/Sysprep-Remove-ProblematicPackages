import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { SUD_SCALE, getSUDColor, getSUDEmoji } from '../theme';
import { Text } from './ui/Text';
import { theme } from '../theme';

interface SUDSliderProps {
  value: number;
  onChange: (value: number) => void;
  showLabels?: boolean;
  showTitle?: boolean;
}

export const SUDSlider: React.FC<SUDSliderProps> = ({
  value,
  onChange,
  showLabels = true,
  showTitle = true,
}) => {
  const prevValue = useRef(value);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const currentEmoji = getSUDEmoji(value);
  const currentColor = getSUDColor(value);
  const currentLabel = SUD_SCALE[value].label;

  useEffect(() => {
    // Trigger haptic feedback when value changes
    if (value !== prevValue.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animate emoji scale
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevValue.current = value;
  }, [value]);

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text variant="h4" align="center" style={styles.title}>
          Rate Your Distress Level
        </Text>
      )}

      {/* Emoji and Value Display */}
      <View style={styles.emojiContainer}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {currentEmoji}
        </Animated.Text>
        <View style={styles.valueRow}>
          <Text variant="h1" color="textPrimary" style={{ color: currentColor }}>
            {value}
          </Text>
        </View>
        <Text variant="bodyLarge" color="textSecondary" style={styles.label}>
          {currentLabel}
        </Text>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={currentColor}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={currentColor}
        />
      </View>

      {/* Emoji Scale */}
      {showLabels && (
        <View style={styles.scaleContainer}>
          <View style={styles.scaleRow}>
            {[0, 2, 4, 6, 8, 10].map((val) => {
              const isActive = value === val;
              const scaleData = SUD_SCALE[val];

              return (
                <View key={val} style={styles.scaleItem}>
                  <Text
                    variant="h3"
                    style={[
                      styles.scaleEmoji,
                      isActive && styles.scaleEmojiActive,
                    ]}
                  >
                    {scaleData.emoji}
                  </Text>
                  <Text
                    variant="captionBold"
                    color="textTertiary"
                    style={[
                      styles.scaleValue,
                      isActive && { color: scaleData.color },
                    ]}
                  >
                    {val}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Color gradient bar */}
          <View style={styles.gradientContainer}>
            <View style={[styles.gradientSection, { backgroundColor: theme.colors.sud.calm }]} />
            <View style={[styles.gradientSection, { backgroundColor: theme.colors.sud.mild }]} />
            <View style={[styles.gradientSection, { backgroundColor: theme.colors.sud.moderate }]} />
            <View style={[styles.gradientSection, { backgroundColor: theme.colors.sud.high }]} />
            <View style={[styles.gradientSection, { backgroundColor: theme.colors.sud.severe }]} />
          </View>

          {/* Labels */}
          <View style={styles.labelsRow}>
            <Text variant="caption" color="textTertiary">
              Calm
            </Text>
            <Text variant="caption" color="textTertiary">
              Distressed
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing[6],
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing[3],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  label: {
    marginTop: theme.spacing[1],
  },
  sliderContainer: {
    width: '100%',
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[2],
  },
  slider: {
    width: '100%',
    height: 48,
  },
  scaleContainer: {
    width: '100%',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  scaleItem: {
    alignItems: 'center',
    minWidth: 40,
  },
  scaleEmoji: {
    fontSize: 24,
    opacity: 0.4,
    marginBottom: theme.spacing[1],
  },
  scaleEmojiActive: {
    opacity: 1,
  },
  scaleValue: {
    fontSize: theme.fontSizes.xs,
  },
  gradientContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing[2],
  },
  gradientSection: {
    flex: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
