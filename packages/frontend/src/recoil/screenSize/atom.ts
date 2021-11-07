import { atom } from 'recoil';

export interface ScreenSize {
  width: number;
  viewportHeight: number;
  actualHeight: number;
  offset: number;
}

const screenSizeAtom = atom<ScreenSize>({
  default: {
    actualHeight: 0,
    offset: 0,
    viewportHeight: 0,
    width: 0,
  },
  key: 'screenSizeAtom',
});

export default screenSizeAtom;
