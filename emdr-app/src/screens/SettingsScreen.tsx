import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { BLSSettings, DOT_COLORS } from '../types';

interface SettingsScreenProps {
  settings: BLSSettings;
  onSettingsChange: (settings: BLSSettings) => void;
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const updateSetting = <K extends keyof BLSSettings>(
    key: K,
    value: BLSSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Modality Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modalities</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Visual</Text>
            <Switch
              value={settings.visualEnabled}
              onValueChange={(value) => updateSetting('visualEnabled', value)}
              trackColor={{ false: '#555', true: '#00A8E8' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Audio</Text>
            <Switch
              value={settings.audioEnabled}
              onValueChange={(value) => updateSetting('audioEnabled', value)}
              trackColor={{ false: '#555', true: '#00A8E8' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic</Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={(value) => updateSetting('hapticEnabled', value)}
              trackColor={{ false: '#555', true: '#00A8E8' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Speed Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speed</Text>
          <Text style={styles.valueLabel}>{settings.speed.toFixed(1)} Hz</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={1.8}
            step={0.1}
            value={settings.speed}
            onValueChange={(value) => updateSetting('speed', value)}
            minimumTrackTintColor="#00A8E8"
            maximumTrackTintColor="#555"
            thumbTintColor="#00A8E8"
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabelText}>0.5 Hz</Text>
            <Text style={styles.rangeLabelText}>1.8 Hz</Text>
          </View>
        </View>

        {/* Visual Settings */}
        {settings.visualEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visual Settings</Text>

            <Text style={styles.subsectionTitle}>Dot Color</Text>
            <View style={styles.colorPalette}>
              {DOT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color.value },
                    settings.dotColor === color.value && styles.colorSwatchSelected,
                  ]}
                  onPress={() => updateSetting('dotColor', color.value)}
                />
              ))}
            </View>

            <Text style={styles.subsectionTitle}>Dot Size</Text>
            <Text style={styles.valueLabel}>{settings.dotSize}px</Text>
            <Slider
              style={styles.slider}
              minimumValue={30}
              maximumValue={80}
              step={5}
              value={settings.dotSize}
              onValueChange={(value) => updateSetting('dotSize', value)}
              minimumTrackTintColor="#00A8E8"
              maximumTrackTintColor="#555"
              thumbTintColor="#00A8E8"
            />
          </View>
        )}

        {/* Audio Settings */}
        {settings.audioEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio Settings</Text>

            <Text style={styles.subsectionTitle}>Volume</Text>
            <Text style={styles.valueLabel}>{Math.round(settings.audioVolume * 100)}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.1}
              value={settings.audioVolume}
              onValueChange={(value) => updateSetting('audioVolume', value)}
              minimumTrackTintColor="#00A8E8"
              maximumTrackTintColor="#555"
              thumbTintColor="#00A8E8"
            />
          </View>
        )}

        {/* Haptic Settings */}
        {settings.hapticEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Haptic Settings</Text>

            <Text style={styles.subsectionTitle}>Intensity</Text>
            <View style={styles.intensityButtons}>
              {(['Light', 'Medium', 'Heavy'] as const).map((intensity) => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.intensityButton,
                    settings.hapticIntensity === intensity && styles.intensityButtonActive,
                  ]}
                  onPress={() => updateSetting('hapticIntensity', intensity)}
                >
                  <Text
                    style={[
                      styles.intensityButtonText,
                      settings.hapticIntensity === intensity &&
                        styles.intensityButtonTextActive,
                    ]}
                  >
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Session Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Settings</Text>

          <Text style={styles.subsectionTitle}>Set Duration</Text>
          <Text style={styles.valueLabel}>{settings.setDuration} seconds</Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={45}
            step={1}
            value={settings.setDuration}
            onValueChange={(value) => updateSetting('setDuration', value)}
            minimumTrackTintColor="#00A8E8"
            maximumTrackTintColor="#555"
            thumbTintColor="#00A8E8"
          />

          <Text style={styles.subsectionTitle}>Rest Interval</Text>
          <Text style={styles.valueLabel}>{settings.restInterval} seconds</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={30}
            step={1}
            value={settings.restInterval}
            onValueChange={(value) => updateSetting('restInterval', value)}
            minimumTrackTintColor="#00A8E8"
            maximumTrackTintColor="#555"
            thumbTintColor="#00A8E8"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#00A8E8',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 16,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueLabel: {
    fontSize: 16,
    color: '#00A8E8',
    fontWeight: '600',
    marginBottom: 8,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabelText: {
    fontSize: 12,
    color: '#999',
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  intensityButtonActive: {
    backgroundColor: '#00A8E8',
  },
  intensityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  intensityButtonTextActive: {
    color: '#fff',
  },
});
