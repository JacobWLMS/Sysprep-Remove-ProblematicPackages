import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeScreenProps {
  onStartSession: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onOpenSettings,
}) => {
  return (
    <LinearGradient
      colors={['#1a1a1a', '#0a0a0a']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>EMDR</Text>
          <Text style={styles.subtitle}>Bilateral Stimulation</Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            A therapeutic tool for Eye Movement Desensitization and Reprocessing therapy.
          </Text>
          <Text style={styles.descriptionText}>
            Combines visual, auditory, and tactile stimulation to help process difficult memories and emotions.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={onStartSession}
          >
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.settingsButton]}
            onPress={onOpenSettings}
          >
            <Text style={[styles.buttonText, styles.settingsButtonText]}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app is designed to support EMDR therapy. Please use under the guidance of a trained professional.
          </Text>
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
    paddingHorizontal: 32,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#00A8E8',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#999',
    letterSpacing: 2,
  },
  description: {
    gap: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#00A8E8',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00A8E8',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButtonText: {
    color: '#00A8E8',
  },
  footer: {
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
