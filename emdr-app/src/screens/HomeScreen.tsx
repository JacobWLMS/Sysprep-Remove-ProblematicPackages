import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useTheme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 380;

interface HomeScreenProps {
  onStartSession: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onOpenSettings,
  onOpenStats,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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
          <Card variant="elevated" padding={5} style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary20 }]}>
              <Ionicons name="eye-outline" size={IS_SMALL_SCREEN ? 28 : 32} color={theme.colors.primary} />
            </View>
            <Text variant={IS_SMALL_SCREEN ? 'h6' : 'h5'} color="textPrimary" style={styles.modalityTitle}>
              Visual
            </Text>
            <Text variant="caption" color="textSecondary" align="center" style={styles.modalityDescription}>
              Smooth animated dot movement
            </Text>
          </Card>

          <Card variant="elevated" padding={5} style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(232, 156, 59, 0.2)' }]}>
              <Ionicons name="headset-outline" size={IS_SMALL_SCREEN ? 28 : 32} color={theme.colors.secondary} />
            </View>
            <Text variant={IS_SMALL_SCREEN ? 'h6' : 'h5'} color="textPrimary" style={styles.modalityTitle}>
              Auditory
            </Text>
            <Text variant="caption" color="textSecondary" align="center" style={styles.modalityDescription}>
              Alternating stereo tones
            </Text>
          </Card>

          <Card variant="elevated" padding={5} style={styles.modalityCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(184, 168, 217, 0.2)' }]}>
              <Ionicons name="hand-left-outline" size={IS_SMALL_SCREEN ? 28 : 32} color={theme.colors.purple} />
            </View>
            <Text variant={IS_SMALL_SCREEN ? 'h6' : 'h5'} color="textPrimary" style={styles.modalityTitle}>
              Tactile
            </Text>
            <Text variant="caption" color="textSecondary" align="center" style={styles.modalityDescription}>
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

        {/* Stats Button */}
        <Button
          variant="secondary"
          size="large"
          fullWidth
          onPress={onOpenStats}
          icon={<Ionicons name="stats-chart" size={24} color={theme.colors.white} />}
        >
          View Your Progress
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

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing[12],
      paddingBottom: theme.spacing[8],
      gap: theme.spacing[5],
    },
    header: {
      gap: theme.spacing[2],
    },
    subtitle: {
      lineHeight: 24,
    },
    welcomeCard: {
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
      flexWrap: 'wrap',
      gap: IS_SMALL_SCREEN ? theme.spacing[3] : theme.spacing[4],
      justifyContent: 'center',
    },
    modalityCard: {
      flex: IS_SMALL_SCREEN ? 0 : 1,
      minWidth: IS_SMALL_SCREEN ? '100%' : 100,
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    iconCircle: {
      width: IS_SMALL_SCREEN ? 56 : 64,
      height: IS_SMALL_SCREEN ? 56 : 64,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing[1],
    },
    modalityTitle: {
      marginBottom: theme.spacing[1],
    },
    modalityDescription: {
      lineHeight: 16,
    },
    startButton: {
      marginTop: theme.spacing[2],
    },
    infoCard: {
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
