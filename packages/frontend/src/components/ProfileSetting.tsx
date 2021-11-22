import {
  NumberSymbol20Regular, LockClosed20Regular,
  QrCode28Regular, Book20Regular,
} from '@fluentui/react-icons';
import React, { useState } from 'react';

import useInput from '../hooks/useInput';
import { mergeClassNames } from '../utils/style';

import SSOAccountList, { SSOAccount } from './SSOAccountList';

const ProfileSetting: React.FC = () => {
  const joinNextInputRef = React.useRef<HTMLInputElement>(null);
  const joinButtonRef = React.useRef<HTMLButtonElement>(null);
  const createButtonRef = React.useRef<HTMLButtonElement>(null);
  const [nickname, onChangeNickName] = useInput('');
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
    <div>
      <section>
        <div className="flex justify-between mb-8 items-end">
          <h2 className="text-sect font-bold mb-0">
            My Profile
          </h2>
          <button type="button" className="text-gray-700 bg-gray-200 rounded-full p-2 justify-self-end">
            <QrCode28Regular className="stroke-current" />
          </button>
        </div>
        <div className="relative w-full h-12 mb-4">
          <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
            <NumberSymbol20Regular className="stroke-current" />
          </div>
          <input
            placeholder="닉네임"
            value={nickname}
            onChange={onChangeNickName}
            className="bg-gray-200 placeholder-gray-500 placeholder-sans text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !!e.currentTarget.value && joinNextInputRef.current) {
                joinNextInputRef.current.focus();
              }
            }}
          />
        </div>
        <button
          ref={joinButtonRef}
          type="submit"
          className={
            mergeClassNames(
              'w-full h-12 rounded-full outline-none flex items-center justify-center text-emph font-bold',
              joinClassId && joinPassword ? `bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
              text-white
              shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
              transition-button duration-button` : 'bg-gray-200 pointer-events-none',
            )
          }
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          <span>Join</span>
        </button>
      </section>
      <section className="mt-14">
        <h2 className="text-sect font-bold mb-8">
          연결된 소셜 계정
        </h2>
        <div>
          <SSOAccountList ssoAccounts={ssoAccounts} onRemove={onRemove} />
        </div>
        <button
          ref={createButtonRef}
          type="submit"
          className={
            mergeClassNames(
              'w-full h-12 rounded-full outline-none flex items-center justify-center text-emph font-bold',
              createClassName ? `bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700
              text-white
              shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button shadow-color-primary
              transition-button duration-button` : 'bg-gray-200 pointer-events-none',
            )
          }
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          <span>+ Connect to new account</span>
        </button>
      </section>
    </div>
  );
};

export default ProfileSetting;
