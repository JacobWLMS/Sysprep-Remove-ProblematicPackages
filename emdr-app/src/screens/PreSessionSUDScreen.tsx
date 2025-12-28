import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SUDSlider } from '../components/SUDSlider';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { theme } from '../theme';

interface PreSessionSUDScreenProps {
  onContinue: (sudValue: number) => void;
  onBack: () => void;
}

export const PreSessionSUDScreen: React.FC<PreSessionSUDScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [sudValue, setSudValue] = useState(5);

  return (
    <LinearGradient
      colors={[theme.colors.backgroundLight, theme.colors.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Button
          variant="ghost"
          size="small"
          onPress={onBack}
          icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
          style={styles.backButton}
        >
          <Text variant="label" color="primary">Back</Text>
        </Button>

        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text variant="h2" align="center" style={styles.title}>
              Before We Begin
            </Text>
            <Text variant="body" color="textSecondary" align="center" style={styles.description}>
              Rate your current level of distress related to the memory or issue you'll be working on.
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} />
          </View>

          <Button
            size="large"
            fullWidth
            onPress={() => onContinue(sudValue)}
            icon={<Ionicons name="play-circle" size={24} color={theme.colors.white} />}
          >
            Start Session
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing[12],
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: theme.layout.screenPadding,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing[12],
  },
  titleContainer: {
    marginTop: theme.spacing[10],
  },
  title: {
    marginBottom: theme.spacing[4],
  },
  description: {
    lineHeight: 24,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing[10],
  },
});
