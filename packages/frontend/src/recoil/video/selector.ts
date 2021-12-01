import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import VideoAtom from './atom';

type playStatus = 'playing' | 'paused' | 'buffering';
export const statusSelector = selector<playStatus>({
  key: 'statusSelector',
  get: ({ get }) => {
    const video = get(VideoAtom);
    return video.status;
  },
  set: ({ set }, status) => {
    if (guardRecoilDefaultValue(status)) return;
    set(VideoAtom, (video) => ({ ...video, status }));
  },
});

export const volumeSelector = selector<number>({
  key: 'volumeSelector',
  get: ({ get }) => {
    const video = get(VideoAtom);
    return video.volume;
  },
  set: ({ set }, volume) => {
    if (guardRecoilDefaultValue(volume)) return;
    set(VideoAtom, (video) => ({ ...video, volume }));
  },
});

export const timeSelector = selector<number>({
  key: 'timeSelector',
  get: ({ get }) => {
    const video = get(VideoAtom);
    return video.timeInYouTube;
  },
  set: ({ set }, timeInYouTube) => {
    if (guardRecoilDefaultValue(timeInYouTube)) return;
    set(VideoAtom, (video) => ({ ...video, timeInYouTube }));
  },
});
