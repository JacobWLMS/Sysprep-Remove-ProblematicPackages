import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Text } from './ui/Text';
import { useTheme } from '../theme';
import { BLSSettings } from '../types';

interface SessionInstructionsProps {
  onContinue: () => void;
  settings: BLSSettings;
}

export const SessionInstructions: React.FC<SessionInstructionsProps> = ({
  onContinue,
  settings,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Build dynamic instructions based on enabled modalities
  const modalities = [];
  if (settings.visualEnabled) modalities.push('visual dot');
  if (settings.audioEnabled) modalities.push('alternating tones');
  if (settings.hapticEnabled) modalities.push('gentle vibrations');

  const modalityText = modalities.length > 0
    ? modalities.join(', ').replace(/, ([^,]*)$/, ' and $1')
    : 'bilateral stimulation';

  return (
    <View style={styles.overlay}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary20 }]}>
            <Ionicons name="information-circle" size={32} color={theme.colors.primary} />
          </View>
          <Text variant="h3" color="textPrimary" align="center">
            Before We Begin
          </Text>
        </View>

        <View style={styles.instructions}>
          <Text variant="bodyLarge" color="textPrimary" style={styles.instruction}>
            Find a comfortable position and take a few deep breaths.
          </Text>

          <Text variant="body" color="textSecondary" style={styles.instruction}>
            During this session, you'll experience {modalityText}. Simply follow along and notice
            what comes up for you.
          </Text>

          <View style={styles.tipsContainer}>
            <Text variant="labelSmall" color="primary" style={styles.tipsHeader}>
              QUICK TIPS
            </Text>

            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                Let thoughts and feelings flow naturally
              </Text>
            </View>

            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                Tap the screen to pause anytime you need
              </Text>
            </View>

            <View style={styles.tip}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                You'll have short breaks between sets
              </Text>
            </View>
          </View>
        </View>

        <Button
          size="large"
          fullWidth
          onPress={onContinue}
          icon={<Ionicons name="arrow-forward" size={24} color={theme.colors.white} />}
        >
          Ready to Begin
        </Button>
      </Card>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background + 'F5', // 96% opacity
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[5],
      zIndex: 999,
    },
    card: {
      width: '100%',
      maxWidth: 480,
      gap: theme.spacing[5],
    },
    header: {
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    instructions: {
      gap: theme.spacing[4],
    },
    instruction: {
      lineHeight: 24,
      textAlign: 'center',
    },
    tipsContainer: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[4],
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    tipsHeader: {
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    tip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    tipText: {
      flex: 1,
      lineHeight: 20,
    },
  });
