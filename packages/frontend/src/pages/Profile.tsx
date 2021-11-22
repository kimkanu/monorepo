import React from 'react';
import { useRecoilValue } from 'recoil';

import ContentPadding from '../components/layout/ContentPadding';
import Fade from '../components/layout/Fade';
import ProfileSettingContent from '../components/profile/ProfileSettingContent';
import useRedirect from '../hooks/useRedirect';

import meState from '../recoil/me';

const Profile: React.FC = () => {
  const me = useRecoilValue(meState.atom);

  const visible = !me.loading && !!me.info;
  useRedirect(!me.loading && !me.info, [me]);

  const [profileImage, setProfileImage] = React.useState('');
  const [isProfileImageChanging, setProfileImageChanging] = React.useState(false);

  React.useEffect(() => {
    if (!me.loading && !!me.info) {
      setProfileImage(me.info.profileImage);
    }
  }, [me]);

  return (
    <ContentPadding isFooterPresent>
      <Fade visible={visible}>
        {(ref) => (
          <ProfileSettingContent
            ref_={ref}
            onDisplayNameChange={() => {}}
            profileImage={profileImage}
            onProfileImageEdit={(file) => {
              console.log(file);
            }}
            isProfileImageChanging={isProfileImageChanging}
            ssoAccounts={me.loading ? [] : me.info?.ssoAccounts ?? []}
            onSSOAccountsRemove={() => {}}
          />
        )}
      </Fade>
    </ContentPadding>
  );
};

export default Profile;
