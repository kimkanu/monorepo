import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import useRedirect, { useRedirectUnauthorized } from '../../hooks/useRedirect';
import classroomsState from '../../recoil/classrooms';
import meState from '../../recoil/me';

const Redirection: React.FC = () => {
  const me = useRecoilValue(meState.atom);
  const meInfo = useRecoilValue(meState.info);
  const classrooms = useRecoilValue(classroomsState.atom);
  const location = useLocation();
  const history = useHistory();

  switch (location.pathname) {
    case '/profile': {
      useRedirectUnauthorized();
      useRedirect(!!meInfo && !meInfo.initialized, '/welcome?redirect_uri=/profile');
      break;
    }
    case '/welcome/done': {
      useRedirectUnauthorized();
      break;
    }
    case '/welcome': {
      if (me.loaded && !meInfo) {
        history.replace('/login?redirect_uri=/welcome');
      }
      break;
    }
  }

  React.useEffect(() => {
    const hash = location.pathname.match(/^\/classrooms\/(\w{3}-\w{3}-\w{3})/)?.[1];
    if (location.pathname.startsWith('/classrooms')) {
      if (hash) {
        if (meInfo) {
          const classroom = classrooms.find((c) => c.hash === hash);
          if (!classroom) {
            if (history.length > 0) {
              history.goBack();
            } else {
              history.replace('/');
            }
          } else {
            history.replace(`/login?redirect_uri=/classrooms/${hash}`);
          }
        }
      } else if (history.length > 0) {
        history.goBack();
      } else {
        history.replace('/');
      }
    }
  }, [location.pathname]);
  return null;
};

export default Redirection;
