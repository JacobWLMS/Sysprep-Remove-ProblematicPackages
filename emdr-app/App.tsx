import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PreSessionSUDScreen } from './src/screens/PreSessionSUDScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { PostSessionSUDScreen } from './src/screens/PostSessionSUDScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { BLSSettings, DEFAULT_SETTINGS, SessionSummary } from './src/types';
import { loadSettings, saveSettings, saveSessionHistory } from './src/utils/storage';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Stats: undefined;
  PreSessionSUD: undefined;
  Session: { preSUD: number };
  PostSessionSUD: { partialSummary: Omit<SessionSummary, 'postSUD'> };
  Summary: { summary: SessionSummary };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [settings, setSettings] = useState<BLSSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialSettings = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      setIsLoading(false);
    };
    loadInitialSettings();
  }, []);

  const handleSettingsChange = async (newSettings: BLSSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <HomeScreen
                onStartSession={() => navigation.navigate('PreSessionSUD')}
                onOpenSettings={() => navigation.navigate('Settings')}
                onOpenStats={() => navigation.navigate('Stats')}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Stats">
            {({ navigation }) => (
              <StatsScreen onClose={() => navigation.goBack()} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Settings">
            {({ navigation }) => (
              <SettingsScreen
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onClose={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="PreSessionSUD">
            {({ navigation }) => (
              <PreSessionSUDScreen
                onContinue={(sudValue) =>
                  navigation.navigate('Session', { preSUD: sudValue })
                }
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Session">
            {({ navigation, route }) => (
              <SessionScreen
                settings={settings}
                preSUD={route.params.preSUD}
                onSessionComplete={(partialSummary) =>
                  navigation.navigate('PostSessionSUD', { partialSummary })
                }
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="PostSessionSUD">
            {({ navigation, route }) => (
              <PostSessionSUDScreen
                partialSummary={route.params.partialSummary}
                onContinue={(summary) =>
                  navigation.navigate('Summary', { summary })
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Summary">
            {({ navigation, route }) => {
              // Save session history when showing summary
              React.useEffect(() => {
                saveSessionHistory(route.params.summary, settings);
              }, [route.params.summary]);

              return (
                <SummaryScreen
                  summary={route.params.summary}
                  onDone={() => navigation.navigate('Home')}
                />
              );
            }}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
