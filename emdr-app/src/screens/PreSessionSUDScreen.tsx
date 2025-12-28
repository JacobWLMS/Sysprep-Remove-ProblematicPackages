import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SUDSlider } from '../components/SUDSlider';

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
      colors={['#1a1a1a', '#0a0a0a']}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Before We Begin</Text>
            <Text style={styles.description}>
              Rate your current level of distress related to the memory or issue you'll be working on.
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} />
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => onContinue(sudValue)}
          >
            <Text style={styles.continueButtonText}>Start Session</Text>
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
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00A8E8',
    fontWeight: '600',
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
