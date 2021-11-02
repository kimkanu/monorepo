import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

import { YouTubePlayer } from 'youtube-player/dist/types';

import useSize from '../hooks/useSize';
import { mergeClassNames, mergeStyles, Styled } from '../utils/style';
import { getYouTubePlayerStateName } from '../utils/youtube';

import styles from './YTPlayer.module.css';

interface Props {
  videoId?: string;
  options?: YouTubeProps['opts'];
}

const YTPlayer: React.FC<Styled<Props>> = ({
  style, className, videoId, options = {},
}) => {
  const aspectRatio = 16 / 9;

  const [youTubeState, setYouTubeState] = React.useState<number>(YouTube.PlayerState.UNSTARTED);
  const [youTubePlayer, setYouTubePlayer] = React.useState<YouTubePlayer | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  return (
    <div
      style={mergeStyles(style)}
      className={mergeClassNames(
        'w-full h-full flex justify-center items-center overflow-hidden',
        className,
        'bg-black',
      )}
      ref={ref}
    >
      <div style={{
        height: size ? Math.min(size.height, size.width / aspectRatio) : '100%',
        width: size ? Math.min(size.width, size.height * aspectRatio) : '100%',
      }}
      >
        {(!!videoId || !!options?.playerVars?.list) ? (
          <YouTube
            videoId={videoId}
            containerClassName={styles.youtubeContainer}
            opts={{
              height: '100%',
              width: '100%',
              ...options,
            }}
            onReady={({ target: player }) => {
              setYouTubePlayer(player);
            }}
            onStateChange={({ data: state }) => {
              setYouTubeState(state);
              console.log(getYouTubePlayerStateName(state));
            }}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-white">
            No videos are shared.
          </div>
        )}
      </div>
    </div>
  );
};

export default YTPlayer;
