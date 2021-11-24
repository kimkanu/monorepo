import { atom } from 'recoil';

import { Theme } from '../../types/theme';

const themeAtom = atom<Theme>({
  key: 'themeAtom',
  default: 'violet',
});

export default themeAtom;
