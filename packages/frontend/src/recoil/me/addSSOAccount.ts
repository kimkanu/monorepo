/* istanbul ignore file */
import { SSOAccountJSON } from '@team-10/lib';
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import meAtom from './atom';

const addSSOAccountSelector = selector<SSOAccountJSON>({
  key: 'addSSOAccountSelector',
  get: () => {
    throw new Error('No getter');
  },
  set: ({ set }, a) => {
    if (guardRecoilDefaultValue(a)) return;
    set(meAtom, (me) => {
      if (me.loading || !me.info) return me;

      const newSSOAccounts = me.info.ssoAccounts.concat(a);
      return { loading: false, info: { ...me.info, ssoAccounts: newSSOAccounts } };
    });
  },
});

export default addSSOAccountSelector;
