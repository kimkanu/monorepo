import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import LoginButton from '../components/buttons/LoginButton';
import loadingState from '../recoil/loading';
import meState from '../recoil/me';

const ProfileConnect: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const me = useRecoilValue(meState.atom);
  const setLoading = useSetRecoilState(loadingState.atom);

  return (
    <Dialog
      visible={me.loaded && !!me.info && location.pathname === '/profile/connect'}
      onClose={() => (history.length > 0 ? history.goBack() : history.replace('/profile'))}
    >
      <div className="flex flex-col gap-6">
        <LoginButton
          provider="naver"
          onClick={() => {
            setLoading(true);
            if (history.length > 0) {
              history.goBack();
            } else {
              history.replace('/profile');
            }
            window.location.href = '/api/auth/naver?redirect_uri=/profile';
          }}
        />
        <LoginButton
          provider="github"
          onClick={() => {
            setLoading(true);
            if (history.length > 0) {
              history.goBack();
            } else {
              history.replace('/profile');
            }
            window.location.href = '/api/auth/github?redirect_uri=/profile';
          }}
        />
      </div>
    </Dialog>
  );
};

export default ProfileConnect;
