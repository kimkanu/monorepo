/* eslint-disable jsx-a11y/label-has-associated-control */
/* istanbul ignore file */
import React, { useState } from 'react';

import SSOAccountList, { SSOAccount } from '../SSOAccountList';

const SSOAccountListTest: React.FC = () => {
  const [ssoAccounts, setSSOAccounts] = useState<SSOAccount[]>([
    { provider: 'naver' as 'naver', providerId: 'blender' },
    { provider: 'github' as 'github', providerId: 'learner' },
  ]);

  const onRemove = (ssoAccount: SSOAccount) => {
    setSSOAccounts(
      ssoAccounts.filter(
        (account) => (account.provider !== ssoAccount.provider
          || account.providerId !== ssoAccount.providerId),
      ),
    );
  };

  return (
    <SSOAccountList ssoAccounts={ssoAccounts} onRemove={onRemove} />
  );
};

export default SSOAccountListTest;
