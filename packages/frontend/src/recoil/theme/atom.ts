import { atom } from 'recoil';

import { Theme } from '../../types/theme';

const themeAtom = atom<Theme>({
  key: 'themeAtom',
  default: (localStorage.getItem('theme') ?? 'violet') as Theme,
});

export default themeAtom;
