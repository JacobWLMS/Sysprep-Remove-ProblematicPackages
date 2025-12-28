import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SUDSlider } from '../components/SUDSlider';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { theme } from '../theme';

interface PreSessionSUDScreenProps {
  onContinue: (sudValue: number, goal?: string) => void;
  onBack: () => void;
}

export const PreSessionSUDScreen: React.FC<PreSessionSUDScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [sudValue, setSudValue] = useState(5);
  const [goal, setGoal] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Button
          variant="ghost"
          size="small"
          onPress={onBack}
          icon={<Ionicons name="arrow-back" size={20} color={theme.colors.primary} />}
          style={styles.backButton}
        >
          <Text variant="label" color="primary">Back</Text>
        </Button>

        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text variant="h2" align="center" style={styles.title}>
              Before We Begin
            </Text>
            <Text variant="body" color="textSecondary" align="center" style={styles.description}>
              Set your intention and rate your current distress level
            </Text>
          </View>

          {/* Goal Setting Card */}
          <Card variant="elevated" style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="bulb-outline" size={24} color={theme.colors.secondary} />
              <Text variant="h5" color="textPrimary">
                What will you focus on?
              </Text>
            </View>
            <Text variant="caption" color="textSecondary" style={styles.goalHint}>
              What memory, feeling, or belief would you like to process today?
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
            />
            <Text variant="caption" color="textTertiary" style={styles.goalCounter}>
              {goal.length}/200
            </Text>
          </Card>

          {/* SUD Rating */}
          <View style={styles.sudSection}>
            <View style={styles.sudHeader}>
              <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
              <Text variant="h5" color="textPrimary">
                How distressing does this feel right now?
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <SUDSlider value={sudValue} onChange={setSudValue} showLabels={true} />
            </View>
          </View>

          {/* Start Button */}
          <Button
            size="large"
            fullWidth
            onPress={() => onContinue(sudValue, goal || undefined)}
            icon={<Ionicons name="play-circle" size={24} color={theme.colors.white} />}
            disabled={!goal.trim()}
          >
            {goal.trim() ? 'Begin Healing' : 'Set Your Intention First'}
          </Button>
          {!goal.trim() && (
            <Text variant="caption" color="textTertiary" align="center" style={styles.requirementHint}>
              A focus helps guide your session
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[8],
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: theme.layout.screenPadding,
    marginBottom: theme.spacing[6],
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing[6],
  },
  titleContainer: {
    gap: theme.spacing[2],
  },
  title: {
    marginBottom: theme.spacing[2],
  },
  description: {
    lineHeight: 24,
  },
  goalCard: {
    padding: theme.layout.cardPadding,
    gap: theme.spacing[3],
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  goalHint: {
    lineHeight: 18,
  },
  goalInput: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontFamily: 'System',
    minHeight: 80,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  goalCounter: {
    alignSelf: 'flex-end',
  },
  sudSection: {
    gap: theme.spacing[4],
  },
  sudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  sliderContainer: {
    paddingVertical: theme.spacing[4],
  },
  requirementHint: {
    marginTop: theme.spacing[2],
  },
});
