import {
  Add20Regular,
} from '@fluentui/react-icons';
import React from 'react';

import githubicon from '../utils/githubicon.png';
import navericon from '../utils/navericon.png';
import { mergeClassNames } from '../utils/style';

import Button from './Button';

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

const SSOAccountList: React.FC<Props> = ({ ssoAccounts, onRemove }) => {
  const ConnectNewAccountRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sect font-bold mb-8">
        연결된 소셜 계정
      </h2>
      {ssoAccounts.map(
        (ssoAccount) => (
          <SSOAccountItem
            ssoAccount={ssoAccount}
            onRemove={() => onRemove(ssoAccount)}
            key={`${ssoAccount.provider}:${ssoAccount.providerId}`}
          />
        ),
      )}
      <div className="relative w-full h-12 mb-4">
        <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
          <Add20Regular className="stroke-current" />
        </div>
        <button
          ref={ConnectNewAccountRef}
          type="submit"
          className="bg-gray-200 placeholder-gray-500 placeholder-sans text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          <span>Connect to new account</span>
        </button>
      </div>
    </div>
  );
};

export default SSOAccountList;
