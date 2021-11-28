/* istanbul ignore file */
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import meAtom from './atom';

const meIdSelector = selector<string | null>({
  key: 'meIdSelector',
  get: ({ get }) => {
    const me = get(meAtom);
    if (!me.loaded) return null;
    return me.info?.stringId ?? null;
  },
  set: ({ set }, a) => {
    if (guardRecoilDefaultValue(a)) return;
    if (!a) return;
    set(meAtom, (me) => {
      if (!me.loaded || !me.info) return me;
      return { loaded: true as true, info: { ...me.info, stringId: a } };
    });
  },
});

export default meIdSelector;
