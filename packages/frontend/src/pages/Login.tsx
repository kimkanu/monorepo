import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import LoginButton from '../components/buttons/LoginButton';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';

import loadingState from '../recoil/loading';
import meState from '../recoil/me';
import appHistory from '../utils/history';

const Login: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const me = useRecoilValue(meState.atom);
  const setLoading = useSetRecoilState(loadingState.atom);

  React.useEffect(() => {
    if (me.loaded && me.info) {
      const query = new URLSearchParams(location.search).get('redirect_uri') ?? '/';
      appHistory.replace(query, history);
    }
  }, [me]);

  return (
    <ContentPadding isFooterPresent>
      <div className="mx-auto mb-16" style={{ maxWidth: 360 }}>
        <Title size="title">로그인</Title>
        <div className="flex flex-col gap-6">
          <LoginButton
            provider="naver"
            onClick={() => {
              setLoading(true);
              window.location.pathname = '/api/auth/naver';
            }}
          />
          <LoginButton
            provider="github"
            onClick={() => {
              setLoading(true);
              window.location.pathname = '/api/auth/github';
            }}
          />
        </div>
      </div>
    </ContentPadding>
  );
};

export default Login;
