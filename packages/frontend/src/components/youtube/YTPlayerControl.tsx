import {
  SpeakerMute24Filled, Speaker224Filled,
} from '@fluentui/react-icons';

import React from 'react';

const timeToHMS = (time:number) => {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time - (h * 3600)) / 60);
  const s = Math.floor(time - (h * 3600) - (m * 60));
  const hour = h ? `${h}:` : '';
  const minute = m / 10 >= 1 ? `${m}:` : `0${m}:`;
  const second = s / 10 >= 1 ? `${s}` : `0${s}`;
  return `${hour}${minute}${second}`;
};

interface Props {
  isInstructor: boolean;
  duration: number;
  volume: number | null;
  currentTime: number;
  setVolume: React.Dispatch<React.SetStateAction<number | null>>;
}

const YTPlayerControl: React.FC<Props> = ({
  isInstructor, duration, volume, setVolume, currentTime, children,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const progress = duration
    ? (currentTime / duration) * (ref.current ? ref.current?.offsetWidth : 0) : 0;

  if (isInstructor) {
    return <>{children}</>;
  }
  return (
    <div className="w-full h-full absolute">
      {children}
      <div className="w-full absolute bottom-2 z-100">
        <div className="w-full mx-auto opacity-0 hover:opacity-100 transition-all duration-300">
          <div className="bg-gray-500 bg-opacity-50 z-50 w-11/12 h-1 mb-4 mx-auto" ref={ref}>
            <div
              className="bg-red-500 h-1 z-60"
              style={{ width: `${progress}px` }}
            />
          </div>
          <div className="w-11/12 flex mx-auto">
            <div
              className="itmes-left opacity-100 inline-block mr-4"
            >
              { volume && volume > 0
                ? <Speaker224Filled primaryFill="white" className="opacity-100 z-50" />
                : <SpeakerMute24Filled primaryFill="white" className="opacity-100 z-50" /> }
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume || 0}
              className="inline-block mr-4"
              onChange={(e) => {
                setVolume(e.target.valueAsNumber);
              }}
            />
            <div className="inline-block text-white text-base font-sans">
              {timeToHMS(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YTPlayerControl;
