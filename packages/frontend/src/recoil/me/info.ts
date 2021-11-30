/* istanbul ignore file */
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';
import { MeInfo } from '../../types/user';

import meAtom from './atom';

const meInfoSelector = selector<Partial<MeInfo> | null>({
  key: 'meInfoSelector',
  get: ({ get }) => {
    const me = get(meAtom);
    if (!me.loaded) return null;
    return me.info;
  },
  set: ({ set }, info) => {
    if (guardRecoilDefaultValue(info)) return;
    if (!info) return;
    set(meAtom, (me) => {
      if (!me.loaded || !me.info) return me;
      return { loaded: true as true, info: { ...me.info, ...info } };
    });
  },
});

export default meInfoSelector;
