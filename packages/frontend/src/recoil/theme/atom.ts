import { atom } from 'recoil';

const themeAtom = atom<'violet' | 'pink' | 'green' | 'blue'>({
  key: 'themeAtom',
  default: 'violet',
});

export default themeAtom;
