import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { theme } from '../theme';

interface HomeScreenProps {
  onStartSession: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onOpenSettings,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" color="brown">
            EMDR Therapy
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            Bilateral Stimulation for Healing
          </Text>
        </View>

        {/* Welcome Card */}
        <Card variant="elevated" style={styles.welcomeCard}>
          <Text variant="h4" color="textPrimary" style={styles.welcomeTitle}>
            Welcome to Your Healing Journey
          </Text>
          <Text variant="body" color="textSecondary" style={styles.welcomeText}>
            Begin a session to experience synchronized visual, auditory, and tactile bilateral stimulation
            for EMDR therapy.
          </Text>
        </Card>

        {/* Three Modalities */}
        <View style={styles.modalitiesContainer}>
          <Card variant="elevated" style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary20 }]}>
              <Ionicons name="eye-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text variant="h5" color="textPrimary" style={styles.modalityTitle}>
              Visual
            </Text>
            <Text variant="caption" color="textSecondary" align="center">
              Smooth animated dot movement
            </Text>
          </Card>

          <Card variant="elevated" style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(232, 156, 59, 0.2)' }]}>
              <Ionicons name="headset-outline" size={32} color={theme.colors.secondary} />
            </View>
            <Text variant="h5" color="textPrimary" style={styles.modalityTitle}>
              Auditory
            </Text>
            <Text variant="caption" color="textSecondary" align="center">
              Alternating stereo tones
            </Text>
          </Card>

          <Card variant="elevated" style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(184, 168, 217, 0.2)' }]}>
              <Ionicons name="hand-left-outline" size={32} color={theme.colors.purple} />
            </View>
            <Text variant="h5" color="textPrimary" style={styles.modalityTitle}>
              Tactile
            </Text>
            <Text variant="caption" color="textSecondary" align="center">
              Gentle haptic feedback
            </Text>
          </Card>
        </View>

        {/* Start Button */}
        <Button
          size="large"
          fullWidth
          onPress={onStartSession}
          icon={<Ionicons name="play-circle" size={28} color={theme.colors.white} />}
          style={styles.startButton}
        >
          Start Your Session
        </Button>

        {/* Settings Button */}
        <Button
          variant="outline"
          size="large"
          fullWidth
          onPress={onOpenSettings}
          icon={<Ionicons name="settings-outline" size={24} color={theme.colors.primary} />}
        >
          Customize Settings
        </Button>

        {/* Info Box */}
        <Card variant="default" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="labelSmall" color="primary">
              Professional Guidance Recommended
            </Text>
          </View>
          <Text variant="caption" color="textSecondary" style={styles.infoText}>
            This app is designed to support EMDR (Eye Movement Desensitization and Reprocessing)
            therapy. For best results, use under the guidance of a trained mental health professional.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[8],
    gap: theme.spacing[6],
  },
  header: {
    gap: theme.spacing[2],
  },
  subtitle: {
    lineHeight: 24,
  },
  welcomeCard: {
    padding: theme.layout.cardPadding,
    gap: theme.spacing[3],
  },
  welcomeTitle: {
    marginBottom: theme.spacing[1],
  },
  welcomeText: {
    lineHeight: 22,
  },
  modalitiesContainer: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  modalityCard: {
    flex: 1,
    padding: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  modalityTitle: {
    marginBottom: theme.spacing[1],
  },
  startButton: {
    marginTop: theme.spacing[4],
  },
  infoCard: {
    padding: theme.spacing[5],
    backgroundColor: theme.colors.primary10,
    gap: theme.spacing[3],
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  infoText: {
    lineHeight: 18,
  },
});
