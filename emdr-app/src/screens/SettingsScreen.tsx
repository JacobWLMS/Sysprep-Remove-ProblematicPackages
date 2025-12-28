import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { Button } from '../components/ui/Button';
import { AppHeader } from '../components/ui/AppHeader';
import { Card } from '../components/ui/Card';
import { Text } from '../components/ui/Text';
import { AudioEngine } from '../components/AudioEngine';
import { BLSSettings, DOT_COLORS } from '../types';
import { useTheme } from '../theme';

interface SettingsScreenProps {
  settings: BLSSettings;
  onSettingsChange: (settings: BLSSettings) => void;
  onClose: () => void;
}

// Quick preset configurations
const PRESETS = {
  gentle: {
    speed: 0.5,
    setDuration: 30,
    restInterval: 15,
    label: 'Gentle',
    icon: 'leaf-outline' as const,
  },
  standard: {
    speed: 1.0,
    setDuration: 24,
    restInterval: 10,
    label: 'Standard',
    icon: 'fitness-outline' as const,
  },
  intense: {
    speed: 1.5,
    setDuration: 20,
    restInterval: 8,
    label: 'Intense',
    icon: 'flash-outline' as const,
  },
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const { theme, mode, toggleTheme } = useTheme();
  const [testingAudio, setTestingAudio] = useState(false);
  const insets = useSafeAreaInsets();
  const [audioEngineRef, setAudioEngineRef] = useState<any>(null);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const updateSetting = <K extends keyof BLSSettings>(
    key: K,
    value: BLSSettings[K]
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSettingsChange({ ...settings, [key]: value });
  };

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    onSettingsChange({
      ...settings,
      speed: preset.speed,
      setDuration: preset.setDuration,
      restInterval: preset.restInterval,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAudioTest = async () => {
    if (testingAudio) {
      // Stop test
      if (audioEngineRef) {
        await audioEngineRef.stop();
      }
      setTestingAudio(false);
    } else {
      // Start test
      if (audioEngineRef) {
        await audioEngineRef.start();
        setTestingAudio(true);
        // Auto-stop after 5 seconds
        setTimeout(() => {
          if (audioEngineRef) {
            audioEngineRef.stop();
          }
          setTestingAudio(false);
        }, 5000);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Hidden AudioEngine for testing */}
      <View style={{ height: 0, overflow: 'hidden' }}>
        <AudioEngine
          enabled={settings.audioEnabled}
          side="left"
          volume={settings.audioVolume}
        />
      </View>

      <AppHeader title="Settings" />

      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, theme.spacing[8]) }]}>
        {/* Presets */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={24} color={theme.colors.primary} />
            <Text variant="h4" style={styles.sectionTitle}>
              Quick Presets
            </Text>
          </View>
          <View style={styles.presetButtons}>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="small"
                onPress={() => applyPreset(key as keyof typeof PRESETS)}
                icon={<Ionicons name={preset.icon} size={20} color={theme.colors.primary} />}
                style={styles.presetButton}
              >
                {preset.label}
              </Button>
            ))}
          </View>
        </Card>

        {/* Appearance */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="contrast-outline" size={24} color={theme.colors.primary} />
            <Text variant="h4" style={styles.sectionTitle}>
              Appearance
            </Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name={mode === 'dark' ? 'moon' : 'sunny'}
                size={20}
                color={theme.colors.textSecondary}
              />
              <View>
                <Text variant="body">Theme</Text>
                <Text variant="caption" color="textTertiary">
                  {mode === 'dark' ? 'Dark mode' : 'Light mode'}
                </Text>
              </View>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={() => {
                toggleTheme();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </Card>

        {/* Modalities */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={24} color={theme.colors.primary} />
            <Text variant="h4" style={styles.sectionTitle}>
              Modalities
            </Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="eye-outline" size={20} color={theme.colors.textSecondary} />
              <Text variant="body">Visual</Text>
            </View>
            <Switch
              value={settings.visualEnabled}
              onValueChange={(value) => updateSetting('visualEnabled', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="headset-outline" size={20} color={theme.colors.textSecondary} />
              <Text variant="body">Audio</Text>
            </View>
            <Switch
              value={settings.audioEnabled}
              onValueChange={(value) => updateSetting('audioEnabled', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="hand-left-outline" size={20} color={theme.colors.textSecondary} />
              <Text variant="body">Haptic</Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={(value) => updateSetting('hapticEnabled', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </Card>

        {/* Speed Control */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="speedometer-outline" size={24} color={theme.colors.primary} />
            <Text variant="h4" style={styles.sectionTitle}>
              Speed
            </Text>
          </View>
          <Text variant="h3" color="primary" style={styles.valueLabel}>
            {settings.speed.toFixed(1)} Hz
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={1.8}
            step={0.1}
            value={settings.speed}
            onValueChange={(value) => updateSetting('speed', value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.rangeLabels}>
            <Text variant="caption" color="textTertiary">
              0.5 Hz (Slow)
            </Text>
            <Text variant="caption" color="textTertiary">
              1.8 Hz (Fast)
            </Text>
          </View>
        </Card>

        {/* Visual Settings */}
        {settings.visualEnabled && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="color-palette-outline" size={24} color={theme.colors.primary} />
              <Text variant="h4" style={styles.sectionTitle}>
                Visual Settings
              </Text>
            </View>

            <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
              Dot Color
            </Text>
            <View style={styles.colorPalette}>
              {DOT_COLORS.map((color) => (
                <Button
                  key={color.value}
                  variant="ghost"
                  onPress={() => updateSetting('dotColor', color.value)}
                  style={
                    settings.dotColor === color.value
                      ? { ...styles.colorSwatch, backgroundColor: color.value, ...styles.colorSwatchSelected }
                      : { ...styles.colorSwatch, backgroundColor: color.value }
                  }
                >
                  {settings.dotColor === color.value && (
                    <Ionicons name="checkmark" size={24} color={theme.colors.white} />
                  )}
                </Button>
              ))}
            </View>

            <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
              Dot Size
            </Text>
            <Text variant="h3" color="primary" style={styles.valueLabel}>
              {settings.dotSize}px
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={30}
              maximumValue={80}
              step={5}
              value={settings.dotSize}
              onValueChange={(value) => updateSetting('dotSize', value)}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.rangeLabels}>
              <Text variant="caption" color="textTertiary">
                30px (Small)
              </Text>
              <Text variant="caption" color="textTertiary">
                80px (Large)
              </Text>
            </View>
          </Card>
        )}

        {/* Audio Settings */}
        {settings.audioEnabled && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="volume-high-outline" size={24} color={theme.colors.primary} />
              <Text variant="h4" style={styles.sectionTitle}>
                Audio Settings
              </Text>
            </View>

            <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
              Volume
            </Text>
            <Text variant="h3" color="primary" style={styles.valueLabel}>
              {Math.round(settings.audioVolume * 100)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
              value={settings.audioVolume}
              onValueChange={(value) => updateSetting('audioVolume', value)}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            {/* Audio Test Button - CRITICAL FEATURE FROM BRIEF */}
            <Button
              variant={testingAudio ? 'secondary' : 'outline'}
              onPress={handleAudioTest}
              icon={
                <Ionicons
                  name={testingAudio ? 'stop-circle' : 'play-circle'}
                  size={20}
                  color={testingAudio ? theme.colors.white : theme.colors.primary}
                />
              }
              style={styles.audioTestButton}
            >
              {testingAudio ? 'Stop Audio Test' : 'Test Audio'}
            </Button>
            <Text variant="caption" color="textTertiary" align="center" style={styles.audioTestHint}>
              Put on headphones to test stereo alternation
            </Text>
          </Card>
        )}

        {/* Haptic Settings */}
        {settings.hapticEnabled && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.primary} />
              <Text variant="h4" style={styles.sectionTitle}>
                Haptic Settings
              </Text>
            </View>

            <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
              Intensity
            </Text>
            <View style={styles.intensityButtons}>
              {(['Light', 'Medium', 'Heavy'] as const).map((intensity) => (
                <Button
                  key={intensity}
                  variant={settings.hapticIntensity === intensity ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => updateSetting('hapticIntensity', intensity)}
                  style={styles.intensityButton}
                >
                  {intensity}
                </Button>
              ))}
            </View>
          </Card>
        )}

        {/* Session Settings */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
            <Text variant="h4" style={styles.sectionTitle}>
              Session Settings
            </Text>
          </View>

          <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
            Set Duration
          </Text>
          <Text variant="h3" color="primary" style={styles.valueLabel}>
            {settings.setDuration} seconds
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={45}
            step={1}
            value={settings.setDuration}
            onValueChange={(value) => updateSetting('setDuration', value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.rangeLabels}>
            <Text variant="caption" color="textTertiary">
              15s
            </Text>
            <Text variant="caption" color="textTertiary">
              45s
            </Text>
          </View>

          <Text variant="label" color="textSecondary" style={styles.subsectionTitle}>
            Rest Interval
          </Text>
          <Text variant="h3" color="primary" style={styles.valueLabel}>
            {settings.restInterval} seconds
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={30}
            step={1}
            value={settings.restInterval}
            onValueChange={(value) => updateSetting('restInterval', value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.rangeLabels}>
            <Text variant="caption" color="textTertiary">
              5s
            </Text>
            <Text variant="caption" color="textTertiary">
              30s
            </Text>
          </View>
        </Card>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <Text variant="caption" color="textSecondary" style={styles.infoText}>
            Settings are automatically saved. Changes take effect on your next session.
          </Text>
        </View>
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing[12],
      paddingBottom: theme.spacing[4],
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingBottom: theme.spacing[10],
      gap: theme.spacing[4],
    },
    section: {
      marginBottom: theme.spacing[4],
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    sectionTitle: {
      flex: 1,
    },
    subsectionTitle: {
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing[3],
    },
    settingLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    slider: {
      width: '100%',
      height: 40,
    },
    valueLabel: {
      marginBottom: theme.spacing[2],
    },
    rangeLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing[1],
    },
    colorPalette: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    colorSwatch: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      borderWidth: 2,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorSwatchSelected: {
      borderColor: theme.colors.white,
      borderWidth: 3,
    },
    intensityButtons: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginTop: theme.spacing[2],
    },
    intensityButton: {
      flex: 1,
    },
    presetButtons: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    presetButton: {
      flex: 1,
    },
    audioTestButton: {
      marginTop: theme.spacing[4],
    },
    audioTestHint: {
      marginTop: theme.spacing[2],
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.primary10,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing[4],
    },
    infoIcon: {
      marginRight: theme.spacing[2],
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      lineHeight: 18,
    },
  });
