/* eslint-disable jsx-a11y/label-has-associated-control */
/* istanbul ignore file */
import React, { useState } from 'react';

import SSOAccountList, { SSOAccount } from '../SSOAccountList';
import UserProfile from '../UserProfile';

const SSOAccountListTest: React.FC = () => {
  const [ssoAccounts, setSSOAccounts] = useState<SSOAccount[]>([
    { provider: 'naver' as 'naver', providerId: 'blender' },
    { provider: 'github' as 'github', providerId: 'learner' },
  ]);
  const Nickname = '닉네임';

  const onRemove = (ssoAccount: SSOAccount) => {
    setSSOAccounts(
      ssoAccounts.filter(
        (account) => (account.provider !== ssoAccount.provider
          || account.providerId !== ssoAccount.providerId),
      ),
    );
  };

  return (
    <div>
      <div className="mb-8">
        <UserProfile prevNickname={Nickname} />
      </div>
      <div>
        <SSOAccountList ssoAccounts={ssoAccounts} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default SSOAccountListTest;
