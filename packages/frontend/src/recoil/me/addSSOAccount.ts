/* istanbul ignore file */
import { SSOAccountJSON } from '@team-10/lib';
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import meAtom from './atom';

const meAddSSOAccountSelector = selector<SSOAccountJSON>({
  key: 'meAddSSOAccountSelector',
  get: () => {
    throw new Error('No getter');
  },
  set: ({ set }, a) => {
    if (guardRecoilDefaultValue(a)) return;
    set(meAtom, (me) => {
      if (!me.loaded || !me.info) return me;

      const newSSOAccounts = me.info.ssoAccounts.concat(a);
      return { loaded: true, info: { ...me.info, ssoAccounts: newSSOAccounts } };
    });
  },
});

export default meAddSSOAccountSelector;
