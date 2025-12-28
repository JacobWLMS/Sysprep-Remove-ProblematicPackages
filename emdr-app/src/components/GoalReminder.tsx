import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { useTheme } from '../theme';

interface GoalReminderProps {
  goal: string;
  onDismiss: () => void;
}

export const GoalReminder: React.FC<GoalReminderProps> = ({ goal, onDismiss }) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Fade in and scale up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Card variant="elevated" style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="bulb" size={32} color={theme.colors.secondary} />
            <Text variant="h5" color="secondary" style={styles.title}>
              Remembering Your Focus
            </Text>
          </View>
          <Text variant="bodyLarge" color="textPrimary" align="center" style={styles.goalText}>
            "{goal}"
          </Text>
          <Text variant="caption" color="textSecondary" align="center" style={styles.hint}>
            Tap anywhere to continue
          </Text>
        </Card>
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.layout.screenPadding,
      zIndex: 1000,
    },
    container: {
      width: '100%',
      maxWidth: 400,
    },
    card: {
      padding: theme.spacing[8],
      gap: theme.spacing[5],
      backgroundColor: theme.colors.surfaceLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[3],
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
    },
    goalText: {
      fontStyle: 'italic',
      lineHeight: 28,
    },
    hint: {
      marginTop: theme.spacing[2],
    },
  });
