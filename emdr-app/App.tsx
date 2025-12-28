import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PreSessionSUDScreen } from './src/screens/PreSessionSUDScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { PostSessionSUDScreen } from './src/screens/PostSessionSUDScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { BLSSettings, DEFAULT_SETTINGS, SessionSummary } from './src/types';
import { loadSettings, saveSettings, saveSessionHistory, loadDemoDataIfNeeded } from './src/utils/storage';
import { ThemeProvider, useTheme } from './src/theme';

export type SessionStackParamList = {
  PreSessionSUD: undefined;
  Session: { preSUD: number; goal?: string };
  PostSessionSUD: { partialSummary: Omit<SessionSummary, 'postSUD'>; goal?: string };
  Summary: { summary: SessionSummary };
};

export type TabParamList = {
  HomeTab: undefined;
  StatsTab: undefined;
  SettingsTab: undefined;
};

const Stack = createNativeStackNavigator<SessionStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
  const [settings, setSettings] = useState<BLSSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialSettings = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      // Load demo data for first-time users
      await loadDemoDataIfNeeded();
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
    <ThemeProvider>
      <AppContent settings={settings} onSettingsChange={handleSettingsChange} />
    </ThemeProvider>
  );
}

// Separate component to access theme inside ThemeProvider
function AppContent({ settings, onSettingsChange }: {
  settings: BLSSettings;
  onSettingsChange: (settings: BLSSettings) => void;
}) {
  const { theme } = useTheme();

  // Home Tab Navigator with session flow
  function HomeTabNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="HomeTab">
          {({ navigation }) => (
            <HomeScreen
              onStartSession={() => navigation.navigate('PreSessionSUD')}
              onOpenSettings={() => {}} // Handled by bottom tabs
              onOpenStats={() => {}} // Handled by bottom tabs
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PreSessionSUD">
          {({ navigation }) => (
            <PreSessionSUDScreen
              onContinue={(sudValue, goal) =>
                navigation.navigate('Session', { preSUD: sudValue, goal })
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
              goal={route.params.goal}
              onSessionComplete={(partialSummary) =>
                navigation.navigate('PostSessionSUD', {
                  partialSummary,
                  goal: route.params.goal
                })
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PostSessionSUD">
          {({ navigation, route }) => (
            <PostSessionSUDScreen
              partialSummary={route.params.partialSummary}
              goal={route.params.goal}
              onContinue={(summary) =>
                navigation.navigate('Summary', {
                  summary: { ...summary, goal: route.params.goal }
                })
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
                onDone={() => navigation.navigate('HomeTab')}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            backgroundColor: theme.colors.backgroundElevated,
            borderTopColor: theme.colors.border,
            paddingTop: 8,
            paddingBottom: 8,
            height: 68,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeTabNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="StatsTab"
          options={{
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        >
          {({ navigation }) => (
            <StatsScreen onClose={() => navigation.navigate('HomeTab')} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="SettingsTab"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        >
          {({ navigation }) => (
            <SettingsScreen
              settings={settings}
              onSettingsChange={onSettingsChange}
              onClose={() => navigation.navigate('HomeTab')}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
