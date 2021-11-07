import { atom } from 'recoil';

const screenSizeAtom = atom<[number, number, number]>({
  default: [0, 0, 0],
  key: 'screenSizeAtom',
});

export default screenSizeAtom;
