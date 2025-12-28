import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { Logo } from '../components/Logo';
import { useTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 380;
const IS_SHORT_SCREEN = SCREEN_HEIGHT < 700;

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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, theme.spacing[4]),
          paddingBottom: Math.max(insets.bottom, theme.spacing[4]),
          paddingLeft: Math.max(insets.left, theme.layout.screenPadding),
          paddingRight: Math.max(insets.right, theme.layout.screenPadding),
        },
      ]}
    >
      {/* Logo and Header */}
      <View style={styles.header}>
        <Logo size={IS_SHORT_SCREEN ? 60 : IS_SMALL_SCREEN ? 70 : 80} />
        <Text variant={IS_SHORT_SCREEN ? 'h3' : 'h2'} color="brown" style={styles.title}>
          EMDR Therapy
        </Text>
        <Text variant="bodySmall" color="textSecondary" style={styles.subtitle}>
          Bilateral Stimulation for Healing
        </Text>
      </View>

      {/* Three Modalities - Compact horizontal row */}
      <View style={styles.modalitiesContainer}>
        <View style={styles.modalityItem}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary20 }]}>
            <Ionicons name="eye-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text variant="labelSmall" color="textPrimary" align="center">
            Visual
          </Text>
        </View>

        <View style={styles.modalityItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(232, 156, 59, 0.2)' }]}>
            <Ionicons name="headset-outline" size={24} color={theme.colors.secondary} />
          </View>
          <Text variant="labelSmall" color="textPrimary" align="center">
            Audio
          </Text>
        </View>

        <View style={styles.modalityItem}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(184, 168, 217, 0.2)' }]}>
            <Ionicons name="hand-left-outline" size={24} color={theme.colors.purple} />
          </View>
          <Text variant="labelSmall" color="textPrimary" align="center">
            Haptic
          </Text>
        </View>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeCard}>
        <Text variant={IS_SHORT_SCREEN ? 'h5' : 'h4'} color="textPrimary" align="center" style={styles.welcomeTitle}>
          Ready to Begin Your Healing Journey?
        </Text>
        <Text variant="bodySmall" color="textSecondary" align="center" style={styles.welcomeText}>
          Experience synchronized bilateral stimulation designed for EMDR therapy
        </Text>
      </View>

      <View style={styles.spacer} />

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

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
        <Text variant="caption" color="textSecondary" style={styles.infoText}>
          Best used under professional guidance
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      gap: IS_SHORT_SCREEN ? theme.spacing[2] : theme.spacing[3],
    },
    title: {
      marginTop: theme.spacing[1],
    },
    subtitle: {
      textAlign: 'center',
    },
    modalitiesContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: IS_SMALL_SCREEN ? theme.spacing[4] : theme.spacing[6],
      paddingVertical: IS_SHORT_SCREEN ? theme.spacing[3] : theme.spacing[4],
    },
    modalityItem: {
      alignItems: 'center',
      gap: theme.spacing[2],
      flex: 1,
      maxWidth: 100,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeCard: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.lg,
      padding: IS_SHORT_SCREEN ? theme.spacing[4] : theme.spacing[5],
      gap: theme.spacing[2],
      ...theme.shadows.sm,
    },
    welcomeTitle: {
      lineHeight: IS_SHORT_SCREEN ? 26 : 30,
    },
    welcomeText: {
      lineHeight: 20,
    },
    spacer: {
      flex: 1,
      minHeight: IS_SHORT_SCREEN ? theme.spacing[2] : theme.spacing[4],
    },
    startButton: {
      marginBottom: theme.spacing[3],
    },
    infoFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
      paddingVertical: theme.spacing[2],
    },
    infoText: {
      lineHeight: 16,
    },
  });
