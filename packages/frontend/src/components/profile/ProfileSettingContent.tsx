import {
  PersonAccounts24Regular,
} from '@fluentui/react-icons';
import { SSOAccountJSON } from '@team-10/lib';
import React from 'react';

import NarrowPageWrapper from '../elements/NarrowPageWrapper';
import Title from '../elements/Title';
import TextInput from '../input/TextInput';

import ProfileImageEditor from './ProfileImageEditor';
import SSOAccountList from './SSOAccountList';

interface Props {
  initialDisplayName: string;
  onDisplayNameChange: (displayName: string) => void;
  profileImage: string;
  isProfileImageChanging: boolean;
  onProfileImageEdit: (file: Blob) => void;
  ssoAccounts: SSOAccountJSON[];
  onSSOAccountsRemove: (ssoAccount: SSOAccountJSON) => void;
}

const ProfileSettingContent: React.FC<Props> = ({
  initialDisplayName,
  onProfileImageEdit,
  profileImage,
  isProfileImageChanging,
  onDisplayNameChange,
  ssoAccounts,
  onSSOAccountsRemove,
}) => {
  const [displayName, setDisplayName] = React.useState(initialDisplayName);

  return (
    <NarrowPageWrapper>
      <section className="mb-16">
        <Title size="title">내 프로필</Title>
        <ProfileImageEditor
          src={profileImage}
          isChanging={isProfileImageChanging}
          onEdit={onProfileImageEdit}
        />
        <TextInput
          containerClassName="my-16"
          value={displayName}
          onInput={(newDisplayName) => {
            setDisplayName(newDisplayName);
            onDisplayNameChange(newDisplayName);
          }}
          icon={(
            <PersonAccounts24Regular
              className="w-5 h-5 block"
              style={{ transform: 'scale(83.33%)', transformOrigin: 'top left' }}
            />
          )}
          placeholderText="이름"
          align="center"
          validator={(v) => !!v}
        />
        <Title size="sect" className="mb-12 mt-4">연결된 소셜 계정</Title>
        <SSOAccountList ssoAccounts={ssoAccounts} onRemove={onSSOAccountsRemove} />
      </section>
    </NarrowPageWrapper>
  );
};

export default ProfileSettingContent;
