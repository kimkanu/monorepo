import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import LoginButton from '../components/buttons/LoginButton';
import ContentPadding from '../components/layout/ContentPadding';

import meState from '../recoil/me';

const Login: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const me = useRecoilValue(meState.atom);

  React.useEffect(() => {
    if (me.loaded && me.info) {
      const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
      history.replace(query);
    }
  }, [me]);

  return (
    <ContentPadding isFooterPresent>
      <div className="mx-auto mb-16" style={{ maxWidth: 360 }}>
        <h1 className="text-title my-16 font-bold text-center">
          로그인
        </h1>
        <div className="flex flex-col gap-6">
          <LoginButton
            provider="naver"
            onClick={() => {
              window.location.pathname = '/api/auth/naver';
            }}
          />
          <LoginButton
            provider="github"
            onClick={() => {
              window.location.pathname = '/api/auth/github';
            }}
          />
        </div>
      </div>
    </ContentPadding>
  );
};

export default Login;
