import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SUDSlider } from '../components/SUDSlider';
import { SessionSummary } from '../types';

interface PostSessionSUDScreenProps {
  partialSummary: Omit<SessionSummary, 'postSUD'>;
  onContinue: (summary: SessionSummary) => void;
}

export const PostSessionSUDScreen: React.FC<PostSessionSUDScreenProps> = ({
  partialSummary,
  onContinue,
}) => {
  const [sudValue, setSudValue] = useState(5);

  const handleContinue = () => {
    const summary: SessionSummary = {
      ...partialSummary,
      postSUD: {
        value: sudValue,
        timestamp: Date.now(),
        type: 'post',
      },
    };
    onContinue(summary);
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0a0a0a']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Session Complete</Text>
            <Text style={styles.description}>
              How do you feel now? Rate your current level of distress.
            </Text>
          </View>

          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonLabel}>Your initial rating was:</Text>
            <Text style={styles.comparisonValue}>{partialSummary.preSUD.value}</Text>
          </View>

          <View style={styles.sliderContainer}>
            <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} />
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>View Summary</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  titleContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  comparisonContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00A8E8',
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  continueButton: {
    backgroundColor: '#00A8E8',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
