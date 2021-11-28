import {
  PersonAccounts24Regular,
} from '@fluentui/react-icons';
import { SSOAccountJSON } from '@team-10/lib';
import CancelablePromise from 'cancelable-promise';
import React from 'react';
import { useRecoilState } from 'recoil';

import meState from '../../recoil/me';
import fetchAPI from '../../utils/fetch';
import NarrowPageWrapper from '../elements/NarrowPageWrapper';
import Title from '../elements/Title';
import TextInput from '../input/TextInput';

import ProfileImageEditor from './ProfileImageEditor';
import SSOAccountList from './SSOAccountList';

interface Props {
  initialDisplayName: string;
  profileImage: string;
  isProfileImageChanging: boolean;
  onProfileImageEdit: (file: Blob) => void;
  ssoAccounts: SSOAccountJSON[];
  onSSOAccountsRemove: (ssoAccount: SSOAccountJSON) => void;
  onSSOAccountsAdd: () => void;
}

const ProfileSettingContent: React.FC<Props> = ({
  initialDisplayName,
  onProfileImageEdit,
  profileImage,
  isProfileImageChanging,
  ssoAccounts,
  onSSOAccountsRemove,
  onSSOAccountsAdd,
}) => {
  const [meInfo, setMeInfo] = useRecoilState(meState.info);
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
  const [isInitial, setInitial] = React.useState(true);

  React.useEffect(() => {
    if (!isInitial) return;
    if (!initialDisplayName) return;
    setInitial(false);
    setDisplayName(initialDisplayName);
  }, [initialDisplayName]);

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
          value={displayName ?? ''}
          onInput={(newDisplayName) => {
            setDisplayName(newDisplayName);
          }}
          icon={(
            <PersonAccounts24Regular
              className="w-5 h-5 block"
              style={{ transform: 'scale(83.33%)', transformOrigin: 'top left' }}
            />
          )}
          placeholderText="이름"
          align="center"
          validator={(newDisplayName) => new CancelablePromise<boolean>((
            resolve, reject, onCancel,
          ) => {
            if (!initialDisplayName) {
              const timeout = setTimeout(() => {
                resolve(true);
              }, 1e+9);
              onCancel(() => {
                clearTimeout(timeout);
              });
              return;
            }

            if (!newDisplayName || !meInfo) {
              resolve(false);
              return;
            }
            if (newDisplayName === initialDisplayName) {
              resolve(true);
              return;
            }

            const timeout = setTimeout(() => {
              fetchAPI('PATCH /users/me', {}, {
                displayName: newDisplayName,
              })
                .then((response) => {
                  if (response.success) {
                    setMeInfo(response.payload);
                    resolve(response.success);
                  }
                })
                .catch(() => {
                  resolve(false);
                });
            }, 1500);

            onCancel(() => {
              clearTimeout(timeout);
            });
          })}
        />
        <Title size="sect" className="mb-12 mt-4">연결된 소셜 계정</Title>
        <SSOAccountList
          onAdd={onSSOAccountsAdd}
          ssoAccounts={ssoAccounts}
          onRemove={onSSOAccountsRemove}
        />
      </section>
    </NarrowPageWrapper>
  );
};

export default ProfileSettingContent;
