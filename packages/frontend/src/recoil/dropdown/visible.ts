/* istanbul ignore file */
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import dropdownAtom from './atom';

const dropdownVisibleSelector = selector<boolean>({
  key: 'dropdownVisibleSelector',
  get: ({ get }) => {
    const dropdown = get(dropdownAtom);
    return dropdown.visible;
  },
  set: ({ set }, visible) => {
    if (guardRecoilDefaultValue(visible)) return;
    set(dropdownAtom, (dropdown) => ({ ...dropdown, visible }));
  },
});

export default dropdownVisibleSelector;
