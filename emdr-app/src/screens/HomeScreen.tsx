import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={[theme.colors.backgroundLight, theme.colors.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="h1" align="center" style={styles.title}>
            EMDR
          </Text>
          <Text variant="bodyLarge" color="textTertiary" align="center" style={styles.subtitle}>
            Bilateral Stimulation
          </Text>
        </View>

        <View style={styles.description}>
          <View style={styles.descriptionItem}>
            <Ionicons name="eye-outline" size={32} color={theme.colors.primary} />
            <Text variant="body" color="textSecondary" align="center">
              Visual
            </Text>
          </View>
          <View style={styles.descriptionItem}>
            <Ionicons name="headset-outline" size={32} color={theme.colors.primary} />
            <Text variant="body" color="textSecondary" align="center">
              Auditory
            </Text>
          </View>
          <View style={styles.descriptionItem}>
            <Ionicons name="hand-left-outline" size={32} color={theme.colors.primary} />
            <Text variant="body" color="textSecondary" align="center">
              Tactile
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text variant="body" color="textSecondary" align="center" style={styles.infoText}>
            A therapeutic tool for Eye Movement Desensitization and Reprocessing therapy.
            Combines three modalities of bilateral stimulation.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            size="large"
            fullWidth
            onPress={onStartSession}
            icon={<Ionicons name="play-circle" size={28} color={theme.colors.white} />}
          >
            Start Session
          </Button>

          <Button
            variant="outline"
            size="large"
            fullWidth
            onPress={onOpenSettings}
            icon={<Ionicons name="settings-outline" size={24} color={theme.colors.primary} />}
          >
            Settings
          </Button>
        </View>

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.textTertiary} />
          <Text variant="caption" color="textTertiary" align="center" style={styles.footerText}>
            This app is designed to support EMDR therapy.{'\n'}
            Please use under the guidance of a trained professional.
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
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing[12],
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing[10],
  },
  title: {
    color: theme.colors.primary,
    letterSpacing: 4,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing[8],
  },
  descriptionItem: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  infoBox: {
    backgroundColor: theme.colors.primary10,
    padding: theme.spacing[5],
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    lineHeight: 24,
  },
  buttonContainer: {
    gap: theme.spacing[4],
  },
  footer: {
    paddingTop: theme.spacing[5],
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  footerText: {
    lineHeight: 18,
  },
});
