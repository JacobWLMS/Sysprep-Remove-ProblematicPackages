import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { StimulationSide } from '../hooks/useBilateralStimulation';

interface AudioEngineProps {
  enabled: boolean;
  side: StimulationSide;
  volume: number; // 0-1
}

export const AudioEngine: React.FC<AudioEngineProps> = ({
  enabled,
  side,
  volume,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isAudioAvailableRef = useRef(false);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Use a simple notification/beep sound from Expo's built-in sounds
        // This avoids needing external audio files
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=notification-sound-7062.mp3' },
          { volume, shouldPlay: false },
          null,
          true
        );
        soundRef.current = sound;
        isAudioAvailableRef.current = true;
      } catch (error) {
        console.log('Audio not available, continuing without audio stimulation:', error);
        isAudioAvailableRef.current = false;
      }
    };

    setupAudio();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const updateVolume = async () => {
      if (!isAudioAvailableRef.current) return;
      try {
        await soundRef.current?.setVolumeAsync(volume);
      } catch (error) {
        console.log('Error updating volume:', error);
      }
    };

    updateVolume();
  }, [volume]);

  useEffect(() => {
    if (!enabled || !isAudioAvailableRef.current || !soundRef.current) return;

    const playSound = async () => {
      try {
        await soundRef.current?.setPositionAsync(0);
        await soundRef.current?.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };

    playSound();
  }, [enabled, side]);

  return null;
};
