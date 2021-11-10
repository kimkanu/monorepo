import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import dialogAtom from './atom';

const dialogVisibleSelector = selector<boolean>({
  key: 'dialogVisibleSelector',
  get: ({ get }) => {
    const dialog = get(dialogAtom);
    return dialog.visible;
  },
  set: ({ set }, visible) => {
    if (guardRecoilDefaultValue(visible)) return;
    set(dialogAtom, (dialog) => ({ ...dialog, visible }));
  },
});

export default dialogVisibleSelector;
