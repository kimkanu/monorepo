import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ContentPadding from '../components/layout/ContentPadding';
import ProfileSettingContent from '../components/profile/ProfileSettingContent';

import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';
import appHistory from '../utils/history';

const Profile: React.FC = () => {
  const [meInfo, setMeInfo] = useRecoilState(meState.info);
  const addToast = useSetRecoilState(toastState.new);
  const history = useHistory();
  const location = useLocation();

  const [profileImage, setProfileImage] = React.useState('');
  const [isProfileImageChanging, setProfileImageChanging] = React.useState(false);

  React.useEffect(() => {
    const toast = new URLSearchParams(location.search).get('toast');
    if (toast) {
      appHistory.replace('/profile', history);
      addToast({
        type: 'error',
        sentAt: new Date(),
        message: toast,
      });
    }
  });

  React.useEffect(() => {
    if (meInfo) {
      setProfileImage(meInfo.profileImage!);
    }
  }, [meInfo]);

  return (
    <ContentPadding isFooterPresent>
      <ProfileSettingContent
        initialDisplayName={meInfo?.displayName ?? ''}
        profileImage={profileImage}
        onProfileImageEdit={(file) => {
          setProfileImageChanging(true);
          const data = new FormData();
          data.append('file', file);
          fetchAPI(
            'PATCH /users/me',
            {},
            data,
          ).then((response) => {
            setProfileImageChanging(false);
            if (response.success) {
              if (meInfo) {
                setMeInfo(response.payload);
                addToast({
                  sentAt: new Date(),
                  type: 'info',
                  message: '프로필 사진 변경이 완료되었습니다!',
                });
              }
            } else {
              addToast({
                sentAt: new Date(),
                type: 'error',
                message: `[${response.error.code}] ${response.error.extra.details ?? ''}`,
              });
            }
          });
        }}
        isProfileImageChanging={isProfileImageChanging}
        ssoAccounts={meInfo?.ssoAccounts ?? []}
        onSSOAccountsRemove={async ({ provider }) => {
          const response = await fetchAPI(
            'DELETE /users/me/sso-accounts/:provider',
            { provider },
          );
          if (response.success) {
            setMeInfo({
              ssoAccounts: meInfo?.ssoAccounts?.filter(({ provider: p }) => p !== provider) ?? [],
            });
          }
        }}
        onSSOAccountsAdd={() => {
          appHistory.push('/profile/connect', history);
        }}
      />
    </ContentPadding>
  );
};

export default Profile;
