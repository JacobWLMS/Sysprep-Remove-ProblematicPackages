import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLSSettings, DEFAULT_SETTINGS } from '../types';

const SETTINGS_KEY = '@emdr_settings';

export const saveSettings = async (settings: BLSSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<BLSSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const clearSettings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
};
