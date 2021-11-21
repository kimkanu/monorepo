import {
  PersonAccounts24Regular, Checkmark20Filled, Edit20Filled,
} from '@fluentui/react-icons';
import React, { useState } from 'react';

import profileIcon from '../utils/profileicon.jpg';
import useInput from '../hooks/useInput';
import { mergeClassNames } from '../utils/style';

import Button from './Button';

interface Props {
  prevNickname : string;
}

const UserProfile: React.FC<Props> = ({ prevNickname }) => {
  const [nickname, onChangeNickName] = useInput('');

  return (
    <div>
      <div className="relative flex justify-center mb-8 items-end">
        <h2 className="text-sect font-bold mb-0">
          My Profile
        </h2>
      </div>
      <div className="relative flex justify-center mb-8 items-end">
        <img className="relative w-20 h-20" src={profileIcon} alt="profile" />
        <Button className="absolute right-20 top-7" width="fit-content" type="neutral" icon={<Edit20Filled />} />
      </div>
      <div className="relative w-full h-12 mb-4">
        <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
          <PersonAccounts24Regular className="stroke-current" />
        </div>
        <input
          placeholder={prevNickname}
          value={nickname}
          onChange={onChangeNickName}
          className="bg-gray-200 placeholder-gray-500 placeholder-sans text-emph w-full h-full pr-5 pl-14 rounded-full font-mono"
        />
        <Button className="absolute right-0 top-0" width="fit-content" type="neutral" icon={<Checkmark20Filled />} />
      </div>
    </div>
  );
};

export default UserProfile;
