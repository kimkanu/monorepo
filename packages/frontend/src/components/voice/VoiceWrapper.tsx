import React from 'react';
import { useRecoilValue } from 'recoil';

import useMainClassroom from '../../hooks/useMainClassroom';
import meState from '../../recoil/me';
import { clamp } from '../../utils/math';
import VoiceBuffer from '../../utils/VoiceBuffer';

import VoiceChat from './VoiceChat';
import WaveVisualizer from './WaveVisualizer';

const VoiceWrapper: React.FC = () => {
  const [audioContext, setAudioContext] = React.useState<AudioContext | null>(null);
  const [voiceBuffer, setVoiceBuffer] = React.useState<VoiceBuffer | null>(null);
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null);

  const [amplitude, setAmplitude] = React.useState(0);
  const [frequency, setFrequency] = React.useState(200);

  React.useEffect(() => {
    const listener = () => {
      const ctx = new AudioContext({
        latencyHint: 'interactive',
        sampleRate: 8000,
      });
      setAudioContext(ctx);

      setVoiceBuffer(new VoiceBuffer(ctx));

      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 64;
      analyserNode.connect(ctx.destination);
      setAnalyser(analyserNode);
    };
    if (!audioContext) {
      window.addEventListener('mousemove', listener);
    }
    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, [!!audioContext]);

  React.useEffect(() => {
    const listener = () => {
      const ctx = new AudioContext({
        latencyHint: 'interactive',
        sampleRate: 8000,
      });
      setAudioContext(ctx);

      setVoiceBuffer(new VoiceBuffer(ctx));

      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 64;
      analyserNode.connect(ctx.destination);
      setAnalyser(analyserNode);
    };
    if (!audioContext) {
      window.addEventListener('keydown', listener);
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [!!audioContext]);

  return (
    <>
      <VoiceChat
        audioContext={audioContext}
        voiceBuffer={voiceBuffer}
        analyser={analyser}
        className="absolute z-layout-3 right-4"
        onVoice={(amp, freq) => {
          setAmplitude(clamp(0, amp, 200));
          setFrequency(clamp(100, freq, 500));
        }}
      />
      <WaveVisualizer amplitude={amplitude} frequency={frequency} />
    </>
  );
};

export default VoiceWrapper;
