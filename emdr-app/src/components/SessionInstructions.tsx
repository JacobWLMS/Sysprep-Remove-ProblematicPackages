import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
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
      <View style={styles.safeContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          <Card variant="elevated" style={styles.card}>
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary20 }]}>
                <Ionicons name="information-circle" size={28} color={theme.colors.primary} />
              </View>
              <Text variant="h4" color="textPrimary" align="center">
                Before We Begin
              </Text>
            </View>

            <Text variant="body" color="textSecondary" style={styles.instruction}>
              During this session, you'll experience {modalityText}. Follow along and notice what comes up for you.
            </Text>

            <View style={styles.tipsContainer}>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                  Let thoughts flow naturally
                </Text>
              </View>

              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                  Tap to pause anytime
                </Text>
              </View>

              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                <Text variant="bodySmall" color="textSecondary" style={styles.tipText}>
                  Short breaks between sets
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            size="medium"
            fullWidth
            onPress={onContinue}
            icon={<Ionicons name="arrow-forward" size={20} color={theme.colors.white} />}
          >
            Ready to Begin
          </Button>
        </View>
      </View>
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
      zIndex: 999,
    },
    safeContainer: {
      flex: 1,
      paddingTop: theme.spacing[6],
      paddingBottom: theme.spacing[4],
      paddingHorizontal: theme.spacing[4],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing[3],
    },
    card: {
      width: '100%',
      maxWidth: 400,
      gap: theme.spacing[4],
      alignSelf: 'center',
      padding: theme.spacing[4],
    },
    header: {
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    instruction: {
      lineHeight: 20,
      textAlign: 'center',
    },
    tipsContainer: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      gap: theme.spacing[2],
    },
    tip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    tipText: {
      flex: 1,
      lineHeight: 18,
    },
    buttonContainer: {
      paddingTop: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      backgroundColor: theme.colors.background,
    },
  });
