import { atom } from 'recoil';

export interface VideoState {
  status: 'playing' | 'paused'
  volume: number | null;
  timeInYouTube: number;
  duration: number;
}

const VideoAtom = atom<VideoState>({
  key: 'videoState',
  default: {
    status: 'paused',
    volume: null,
    timeInYouTube: 0,
    duration: 0,
  },
});

export default VideoAtom;
