import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { theme, getSUDColor, getSUDEmoji } from '../theme';

interface QuickSUDCheckProps {
  onSubmit: (value: number) => void;
  onSkip: () => void;
  initialValue?: number;
}

export const QuickSUDCheck: React.FC<QuickSUDCheckProps> = ({
  onSubmit,
  onSkip,
  initialValue = 5,
}) => {
  const [value, setValue] = useState(initialValue);

  const currentColor = getSUDColor(value);
  const currentEmoji = getSUDEmoji(value);

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={styles.container}
    >
      <Card variant="elevated" style={styles.card}>
        <Text variant="h5" align="center" style={styles.title}>
          How are you feeling now?
        </Text>

        <View style={styles.emojiContainer}>
          <Text style={[styles.emoji]}>{currentEmoji}</Text>
          <Text variant="h2" style={{ color: currentColor }}>
            {value}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={setValue}
          minimumTrackTintColor={currentColor}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={currentColor}
        />

        <View style={styles.buttons}>
          <Button
            variant="ghost"
            onPress={onSkip}
            style={styles.skipButton}
            size="small"
          >
            Skip
          </Button>
          <Button
            onPress={() => onSubmit(value)}
            style={styles.submitButton}
            size="small"
          >
            Submit
          </Button>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: theme.spacing[5],
    right: theme.spacing[5],
    transform: [{ translateY: -120 }],
    zIndex: 100,
  },
  card: {
    paddingVertical: theme.spacing[6],
  },
  title: {
    marginBottom: theme.spacing[4],
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing[2],
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing[4],
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  skipButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
