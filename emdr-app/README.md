# EMDR Bilateral Stimulation App

A React Native mobile application built with Expo that delivers bilateral stimulation for EMDR (Eye Movement Desensitization and Reprocessing) therapy. Supports iOS and Android.

## Features

### Three Synchronized Stimulation Modalities

1. **Visual Stimulation**
   - Smooth 60fps animated dot moving horizontally across the screen
   - Adjustable speed (0.5 - 1.8 Hz)
   - Customizable dot size and color
   - High contrast on dark background
   - Landscape orientation during active sessions

2. **Auditory Stimulation**
   - Alternating stereo audio tones
   - Synced to master speed setting
   - Adjustable volume
   - Graceful fallback if audio unavailable

3. **Tactile (Haptic) Stimulation**
   - Alternating haptic feedback patterns
   - Three intensity levels (Light, Medium, Heavy)
   - Synced to master speed setting
   - Perceptual left/right distinction

### Session Management

- **Pre-Session SUD Rating**: Rate distress level (0-10) before starting
- **Configurable Session Parameters**:
  - Set duration: 15-45 seconds
  - Rest interval between sets: 5-30 seconds
  - Maximum session duration: 20 minutes
  - Maximum sets: 30
- **Auto-advancing Sets**: Automatic progression through sets with rest periods
- **Session Controls**: Large start/pause/stop buttons with tap-anywhere pause
- **Post-Session SUD Rating**: Rate distress level after completion
- **Session Summary**: View SUD change, duration, and sets completed

### Settings

All preferences are persisted using AsyncStorage:
- Toggle individual modalities on/off
- Speed slider (0.5 - 1.8 Hz)
- Visual settings: dot color palette, size adjustment
- Audio settings: volume control
- Haptic settings: intensity selection
- Session timing: set duration and rest intervals

### User Experience

- Dark theme for reduced eye strain
- Minimal UI during active stimulation
- Smooth screen transitions
- Screen stays awake during sessions
- Landscape orientation lock during sessions
- Calm color palette

## Technical Stack

- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Animation**: react-native-reanimated (60fps)
- **Audio**: expo-av
- **Haptics**: expo-haptics
- **Storage**: @react-native-async-storage/async-storage
- **Screen Control**: expo-screen-orientation, expo-keep-awake

## Project Structure

```
emdr-app/
├── src/
│   ├── components/
│   │   ├── VisualStimulus.tsx      # Animated dot component
│   │   ├── AudioEngine.tsx         # Audio playback controller
│   │   ├── HapticEngine.tsx        # Haptic feedback controller
│   │   ├── SessionTimer.tsx        # Session info display
│   │   └── SUDSlider.tsx           # Distress rating slider
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Main landing screen
│   │   ├── SettingsScreen.tsx      # Settings configuration
│   │   ├── PreSessionSUDScreen.tsx # Pre-session distress rating
│   │   ├── SessionScreen.tsx       # Active BLS session
│   │   ├── PostSessionSUDScreen.tsx# Post-session distress rating
│   │   └── SummaryScreen.tsx       # Session results
│   ├── hooks/
│   │   ├── useBilateralStimulation.ts  # Master timing coordination
│   │   └── useSessionTimer.ts          # Session/set timer logic
│   ├── utils/
│   │   └── storage.ts              # AsyncStorage helpers
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── App.tsx                         # Root component with navigation
└── babel.config.js                 # Babel config with reanimated plugin
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emdr-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - iOS: Press `i` or scan QR code with Expo Go app
   - Android: Press `a` or scan QR code with Expo Go app
   - Web: Press `w` (limited functionality - haptics won't work)

## Testing

For the best experience and to test all features:

1. **Use a physical device** (haptics don't work in simulators)
2. **Use headphones** to verify stereo audio separation
3. **Test different speeds** to verify synchronization
4. **Check landscape orientation** locks during sessions
5. **Verify screen stays awake** during active sessions

## Customization

### Audio Tones

The app currently uses a placeholder audio tone. To use custom stereo tones:

1. Generate or obtain 196 Hz sine wave tones (250ms duration)
2. Create separate left and right channel files
3. Place them in `src/assets/audio/` as:
   - `tone-left.mp3`
   - `tone-right.mp3`
4. Update `AudioEngine.tsx` to load local files instead of the URL

### Visual Customization

Modify `src/types/index.ts` to add more color options to `DOT_COLORS` array.

## Important Notes

### Clinical Use

This app is designed to support EMDR therapy and should be used under the guidance of a trained EMDR therapist. It is not a replacement for professional mental health treatment.

### No Authentication/Data Collection

This version intentionally excludes:
- User authentication
- Cloud data storage
- Analytics
- Safety screening questionnaires

All data is stored locally on the device and is not transmitted anywhere.

## Build for Production

### iOS

```bash
npx expo build:ios
```

### Android

```bash
npx expo build:android
```

For more details, see [Expo build documentation](https://docs.expo.dev/build/introduction/).

## Future Enhancements

Potential additions (not currently implemented):
- User authentication and cloud sync
- Session history and progress tracking
- Therapist notes integration
- Safety screening questionnaires
- Customizable audio tones
- Additional color schemes/themes
- Export session data

## License

[Add your license here]

## Support

For issues or questions, please [open an issue](link-to-issues) on the repository.

## Acknowledgments

Built with Expo and React Native. Uses bilateral stimulation techniques from EMDR therapy research.
