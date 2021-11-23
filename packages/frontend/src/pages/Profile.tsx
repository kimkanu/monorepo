import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import ContentPadding from '../components/layout/ContentPadding';
import Fade from '../components/layout/Fade';
import ProfileSettingContent from '../components/profile/ProfileSettingContent';
import useRedirect from '../hooks/useRedirect';

import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';

const Profile: React.FC = () => {
  const [me, setMe] = useRecoilState(meState.atom);
  const addToast = useSetRecoilState(toastState.new);

  useRedirect(me.loaded && !me.info, [me]);

  const [profileImage, setProfileImage] = React.useState('');
  const [isProfileImageChanging, setProfileImageChanging] = React.useState(false);

  React.useEffect(() => {
    if (me.loaded && !!me.info) {
      setProfileImage(me.info.profileImage);
    }
  }, [me]);

  return (
    <ContentPadding isFooterPresent>
      <Fade visible={me.loaded && !!me.info}>
        {(ref) => (
          <ProfileSettingContent
            ref_={ref}
            initialDisplayName={(me.loaded ? me.info?.displayName : null) ?? ''}
            onDisplayNameChange={() => {}}
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
                  if (me.loaded && me.info) {
                    setMe({
                      loaded: true,
                      info: {
                        ...me.info,
                        ...response.payload,
                      },
                    });
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
            ssoAccounts={!me.loaded ? [] : me.info?.ssoAccounts ?? []}
            onSSOAccountsRemove={() => {}}
          />
        )}
      </Fade>
    </ContentPadding>
  );
};

export default Profile;
