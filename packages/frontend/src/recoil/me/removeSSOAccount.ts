/* istanbul ignore file */
import { SSOAccountJSON } from '@team-10/lib';
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import meAtom from './atom';

const removeSSOAccountSelector = selector<SSOAccountJSON>({
  key: 'removeSSOAccountSelector',
  get: () => {
    throw new Error('No getter');
  },
  set: ({ set }, a) => {
    if (guardRecoilDefaultValue(a)) return;
    set(meAtom, (me) => {
      if (me.loading || !me.info) return me;

      const newSSOAccounts = me.info.ssoAccounts.filter((s) => (
        s.provider === a.provider && s.providerId === a.providerId
      ));
      return { loading: false, info: { ...me.info, ssoAccounts: newSSOAccounts } };
    });
  },
});

export default removeSSOAccountSelector;
