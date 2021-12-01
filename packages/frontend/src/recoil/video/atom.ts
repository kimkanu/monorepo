import { atom } from 'recoil';

export interface VideoState {
  status: 'playing' | 'paused' | 'buffering'
  volume: number;
  timeInYouTube: number;
}

const VideoAtom = atom<VideoState>({
  key: 'videoState',
  default: {
    status: 'paused',
    volume: 100,
    timeInYouTube: 0,
  },
});

export default VideoAtom;
