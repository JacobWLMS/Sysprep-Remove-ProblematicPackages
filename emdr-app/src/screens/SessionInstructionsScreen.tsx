import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { AppHeader } from '../components/ui/AppHeader';
import { Text } from '../components/ui/Text';
import { useTheme } from '../theme';
import { BLSSettings, DEFAULT_SETTINGS } from '../types';

interface SessionInstructionsScreenProps {
  preSUD: number;
  goal: string;
  onContinue: () => void;
  onBack: () => void;
  settings?: BLSSettings;
}

export const SessionInstructionsScreen: React.FC<SessionInstructionsScreenProps> = ({
  preSUD,
  goal,
  onContinue,
  onBack,
  settings = DEFAULT_SETTINGS,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Session Guide"
        left={{ onPress: onBack, icon: <Ionicons name="arrow-back" size={20} color={theme.colors.primary} /> }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.layout.screenPadding,
            paddingBottom: Math.max(insets.bottom, theme.spacing[4]),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
            <Ionicons name="eye" size={32} color={theme.colors.primary} />
          </View>
          <Text variant="h4" style={styles.sectionTitle}>Focus Your Attention</Text>
          <Text variant="body" color="textSecondary" style={styles.sectionText}>
            Keep your eyes on the moving dot. Let it guide your attention as it flows left and right across the screen.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.secondary + '15' }]}>
            <Ionicons name="ear" size={32} color={theme.colors.secondary} />
          </View>
          <Text variant="h4" style={styles.sectionTitle}>Listen Mindfully</Text>
          <Text variant="body" color="textSecondary" style={styles.sectionText}>
            {settings.audioEnabled
              ? 'You\'ll hear alternating tones in each ear. This helps activate both sides of your brain.'
              : 'Audio is disabled in your settings, but you can enable it anytime.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.purple + '15' }]}>
            <Ionicons name="hand-left" size={32} color={theme.colors.purple} />
          </View>
          <Text variant="h4" style={styles.sectionTitle}>Feel the Rhythm</Text>
          <Text variant="body" color="textSecondary" style={styles.sectionText}>
            {settings.hapticEnabled
              ? 'You\'ll feel gentle taps alternating between left and right. This enhances the bilateral stimulation.'
              : 'Haptic feedback is disabled in your settings, but you can enable it anytime.'}
          </Text>
        </View>

        <View style={[styles.section, styles.reminderSection]}>
          <Text variant="h5" color="textPrimary" style={styles.reminderTitle}>Remember</Text>
          <View style={styles.reminderItem}>
            <Text variant="body" color="textSecondary">
              • Work{goal ? ' with your intention: ' : ' with whatever comes up'}{goal && <Text variant="body" color="primary">{goal}</Text>}
            </Text>
          </View>
          <View style={styles.reminderItem}>
            <Text variant="body" color="textSecondary">
              • The process is natural—just follow the stimulation
            </Text>
          </View>
          <View style={styles.reminderItem}>
            <Text variant="body" color="textSecondary">
              • You can pause anytime if you need a break
            </Text>
          </View>
          <View style={styles.reminderItem}>
            <Text variant="body" color="textSecondary">
              • Trust your body's healing process
            </Text>
          </View>
        </View>

        <View style={styles.sudInfo}>
          <Text variant="caption" color="textSecondary" align="center">
            Starting SUD level: <Text variant="caption" color="primary">{preSUD}/10</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[4]) }]}>
        <Button
          size="large"
          fullWidth
          onPress={onContinue}
          icon={<Ionicons name="play" size={24} color={theme.colors.white} />}
        >
          Start Session
        </Button>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingTop: theme.spacing[4],
      gap: theme.spacing[5],
    },
    section: {
      gap: theme.spacing[3],
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      marginTop: theme.spacing[1],
    },
    sectionText: {
      lineHeight: 22,
    },
    reminderSection: {
      backgroundColor: theme.colors.surfaceLight,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing[2],
    },
    reminderTitle: {
      marginBottom: theme.spacing[2],
    },
    reminderItem: {
      gap: theme.spacing[1],
    },
    sudInfo: {
      paddingVertical: theme.spacing[3],
    },
    footer: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing[3],
      backgroundColor: theme.colors.background,
    },
  });
