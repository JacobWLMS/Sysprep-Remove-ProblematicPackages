import React, { useEffect, useRef } from 'react';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';
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
  const player = useAudioPlayer('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=notification-sound-7062.mp3');
  const isAudioAvailableRef = useRef(true);

  // Update volume when it changes
  useEffect(() => {
    if (player && isAudioAvailableRef.current) {
      try {
        player.volume = volume;
      } catch (error) {
        console.log('Error updating volume:', error);
      }
    }
  }, [volume, player]);

  // Play sound when enabled and side changes
  useEffect(() => {
    if (!enabled || !isAudioAvailableRef.current || !player) return;

    const playSound = async () => {
      try {
        player.seekTo(0);
        player.play();
      } catch (error) {
        console.log('Error playing sound:', error);
        isAudioAvailableRef.current = false;
      }
    };

    playSound();
  }, [enabled, side, player]);

  return null;
};
