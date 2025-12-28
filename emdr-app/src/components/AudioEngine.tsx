import React, { useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { StimulationSide } from '../hooks/useBilateralStimulation';

interface AudioEngineProps {
  enabled: boolean;
  side: StimulationSide;
  volume: number; // 0-1
}

// Generate a short sine wave PCM16 WAV and return base64 string
function generateSineWavBase64(freq = 400, durationSec = 0.08, sampleRate = 22050) {
  const samples = Math.floor(durationSec * sampleRate);
  const amplitude = 0.6; // headroom

  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk length
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // channels
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate (sampleRate * blockAlign)
  view.setUint16(32, 2, true); // block align (channels * bytesPerSample)
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, samples * 2, true);

  // PCM samples
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freq * t) * amplitude;
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Convert to base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  // btoa may not exist in RN; use Buffer if available, otherwise fallback
  let base64 = '';
  try {
    base64 = global.btoa(binary);
  } catch (e) {
    // Buffer exists in node-like environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Buffer = require('buffer').Buffer;
    base64 = Buffer.from(binary, 'binary').toString('base64');
  }

  return base64;
}

export const AudioEngine: React.FC<AudioEngineProps> = ({ enabled, side, volume }) => {
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Set audio mode once
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
      } catch (e) {
        console.log('AudioEngine setAudioMode error', e);
      }
    };

    initAudio();
  }, []);

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      try {
        const base64 = generateSineWavBase64(400, 0.08, 22050); // 400Hz dull tone
        const uri = `data:audio/wav;base64,${base64}`;
        const player = createAudioPlayer({ uri });
        if (!mounted) {
          player.remove();
          return;
        }
        playerRef.current = player;
      } catch (error) {
        console.log('AudioEngine prepare error', error);
      }
    };

    prepare();

    return () => {
      mounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.remove();
          playerRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume;
    }
  }, [volume]);

  // Play on trigger
  useEffect(() => {
    if (!enabled || !playerRef.current) return;

    const play = async () => {
      try {
        // Seek to beginning to allow replaying
        await playerRef.current!.seekTo(0);
        playerRef.current!.play();
      } catch (error) {
        console.log('AudioEngine play error', error);
      }
    };

    play();
  }, [enabled, side]);

  return null;
};
