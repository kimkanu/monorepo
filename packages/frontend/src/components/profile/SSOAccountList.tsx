import {
  Add20Regular, Dismiss20Regular,
} from '@fluentui/react-icons';
import { Provider, SSOAccountJSON } from '@team-10/lib';
import React from 'react';

import GitHubLogo from '../../assets/github-logo.svg';
import NaverLogo from '../../assets/naver-logo.svg';
import { mergeClassNames } from '../../utils/style';
import Button from '../buttons/Button';

interface ItemProps {
  ssoAccount: SSOAccountJSON;
  removable: boolean;
  onRemove?: () => void;
}

const logos = {
  naver: NaverLogo,
  github: GitHubLogo,
};
const providerClassName: Record<Provider, string> = {
  naver: 'w-5 h-5',
  github: 'w-7 h-7',
};

const SSOAccountItem: React.FC<ItemProps> = ({ ssoAccount, removable, onRemove }) => (
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
    <div style={{ width: 62 }} className="absolute h-12 left-0 top-0 flex justify-center items-center">
      <img
        className={providerClassName[ssoAccount.provider]}
        src={logos[ssoAccount.provider]}
        alt={ssoAccount.provider}
      />
    </div>
    <span className="font-mono font-emph font-bold">{ssoAccount.providerId}</span>
    {removable && <Button onClick={onRemove} className="absolute right-0 top-0" width="fit-content" type="destructive" icon={<Dismiss20Regular />} />}
  </div>
);

interface Props {
  ssoAccounts: SSOAccountJSON[];
  onRemove: (ssoAccount: SSOAccountJSON) => void;
  onAdd: () => void;
}

const SSOAccountList: React.FC<Props> = ({ ssoAccounts, onRemove, onAdd }) => (
  <div className="flex flex-col gap-4">
    {ssoAccounts.map(
      (ssoAccount) => (
        <SSOAccountItem
          ssoAccount={ssoAccount}
          removable={ssoAccounts.length > 1}
          onRemove={() => onRemove(ssoAccount)}
          key={`${ssoAccount.provider}:${ssoAccount.providerId}`}
        />
      ),
    )}
    <Button width="full" type="primary" text="다른 소셜 계정 연결" icon={<Add20Regular />} onClick={onAdd} />
  </div>
);

export default SSOAccountList;
