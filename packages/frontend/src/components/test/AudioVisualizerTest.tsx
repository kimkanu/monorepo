/* istanbul ignore file */
import React from 'react';

import WaveVisualizer from '../voice/WaveVisualizer';

const AudioVisualizerTest: React.FC = () => {
  const [amp, setAmp] = React.useState(100);
  const [freq, setFreq] = React.useState(200);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <input
        type="range"
        min="100"
        max="400"
        value={freq}
        onChange={(e) => {
          setFreq(parseFloat(e.currentTarget.value));
        }}
      />
      <input
        type="range"
        min="0"
        max="200"
        value={amp}
        onChange={(e) => {
          setAmp(parseFloat(e.currentTarget.value));
        }}
      />
      <WaveVisualizer amplitude={amp} frequency={freq} />
    </div>
  );
};

export default AudioVisualizerTest;
