import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { useTheme } from '../theme';

interface GoalSettingScreenProps {
  onContinue: (goal: string) => void;
  onBack: () => void;
}

export const GoalSettingScreen: React.FC<GoalSettingScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, theme.spacing[5]),
            paddingBottom: Math.max(insets.bottom, theme.spacing[5]),
            paddingLeft: Math.max(insets.left, theme.layout.screenPadding),
            paddingRight: Math.max(insets.right, theme.layout.screenPadding),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Button
          variant="ghost"
          size="small"
          onPress={onBack}
          icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
          style={styles.backButton}
        >
          <Text variant="label" color="primary">
            Back
          </Text>
        </Button>

        <View style={styles.mainContent}>
          <View>
            <View style={styles.titleContainer}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Ionicons name="bulb" size={28} color={theme.colors.secondary} />
              </View>
              <Text variant="h3" align="center" style={styles.title}>
                Set Your Intention
              </Text>
              <Text variant="bodySmall" color="textSecondary" align="center" style={styles.description}>
                What would you like to focus on?
              </Text>
            </View>

            <Card variant="elevated" style={styles.goalCard}>
              <Text variant="caption" color="textSecondary" style={styles.goalHint}>
                What memory, feeling, or belief would you like to process?
              </Text>
              <TextInput
                style={styles.goalInput}
                placeholder="e.g., Letting go of anxiety about work..."
                placeholderTextColor={theme.colors.textTertiary}
                value={goal}
                onChangeText={setGoal}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
                autoFocus
              />
              <Text variant="caption" color="textTertiary" style={styles.goalCounter}>
                {goal.length}/200
              </Text>
            </Card>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              size="large"
              fullWidth
              onPress={() => onContinue(goal.trim())}
              icon={<Ionicons name="arrow-forward" size={24} color={theme.colors.white} />}
              disabled={!goal.trim()}
            >
              {goal.trim() ? 'Continue' : 'Enter Your Focus First'}
            </Button>
            {!goal.trim() && (
              <Text variant="caption" color="textTertiary" align="center" style={styles.hint}>
                Setting an intention helps guide your healing journey
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: theme.spacing[3],
    },
    mainContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    titleContainer: {
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: theme.spacing[1],
    },
    description: {
      lineHeight: 22,
    },
    goalCard: {
      padding: theme.spacing[4],
      gap: theme.spacing[3],
    },
    goalHint: {
      lineHeight: 18,
    },
    goalInput: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[3],
      fontSize: 16,
      color: theme.colors.textPrimary,
      minHeight: 90,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    goalCounter: {
      alignSelf: 'flex-end',
    },
    buttonContainer: {
      paddingTop: theme.spacing[4],
    },
    hint: {
      marginTop: theme.spacing[2],
    },
  });
