import React from 'react';

import { mergeClassNames } from '../utils/style';

import Button from './Button';
import githubicon from './githubicon.png';
import navericon from './navericon.png';

export interface SSOAccount {
  provider: 'naver' | 'github';
  providerId: string;
}

interface ItemProps {
  ssoAccount: SSOAccount;
  onRemove?: () => void;
}

const SSOAccountItem: React.FC<ItemProps> = ({ ssoAccount, onRemove }) => (
  <div
    className={
    mergeClassNames(
      'w-full h-12 rounded-full text-white flex justify-center items-center relative',
    )
  }
    style={{
      backgroundColor: ssoAccount.provider === 'naver' ? '#00c73c' : '#000',
    }}
  >
    <div style={{ width: 62, height: 48 }} className="absolute left-0 top-0 flex justify-center items-center">
      <img className="w-10 h-10" src={ssoAccount.provider === 'naver' ? navericon : githubicon} alt={ssoAccount.provider} />
    </div>
    <span>{ssoAccount.providerId}</span>
    <Button onClick={onRemove} className="absolute right-0 top-0" width="fit-content" type="destructive" icon={<span>X</span>} />
  </div>
);

interface Props {
  ssoAccounts: SSOAccount[];
  onRemove: (ssoAccount: SSOAccount) => void;
}

const SSOAccountList: React.FC<Props> = ({ ssoAccounts, onRemove }) => (
  <div className="flex flex-col gap-4">
    {ssoAccounts.map(
      (ssoAccount) => (
        <SSOAccountItem
          ssoAccount={ssoAccount}
          onRemove={() => onRemove(ssoAccount)}
          key={`${ssoAccount.provider}:${ssoAccount.providerId}`}
        />
      ),
    )}
  </div>
);

export default SSOAccountList;
