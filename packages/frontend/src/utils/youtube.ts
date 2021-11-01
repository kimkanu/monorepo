import YouTube from 'react-youtube';

// eslint-disable-next-line import/prefer-default-export
export function getYouTubePlayerStateName(state: number): string | null {
  return Object.entries(YouTube.PlayerState)
    .find(([, value]) => value === state)?.[0] ?? null;
}
