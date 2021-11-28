/* istanbul ignore file */
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import meState from '../../recoil/me';
import appHistory from '../../utils/history';

const HistoryListener: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const me = useRecoilValue(meState.atom);
  const meInfo = useRecoilValue(meState.info);

  React.useEffect(() => {
    appHistory.reset(`${window.location.pathname}${window.location.search}`);
    appHistory.followInitialHistory(history);
  }, []);

  React.useEffect(() => history.listen((loc) => {
    if (history.action === 'POP') {
      appHistory.repairInternal(loc.pathname);
    }
  }), [history]);

  React.useEffect(() => {
    // Redirect to /welcome if user is uninitialized and the location is not at /welcome
    if (location.pathname !== '/welcome' && me.loaded && !!meInfo && !meInfo.initialized) {
      appHistory.reset('/welcome', history);
    }
  }, [me.loaded, meInfo, location.pathname]);

  React.useEffect(() => {
    // Redirect to /welcome/done if user is initialized and the location is at /welcome
    if (location.pathname === '/welcome' && me.loaded && !!meInfo && meInfo.initialized) {
      appHistory.reset(`/welcome/done${appHistory.searchToString()}`, history);
    }
  }, [me.loaded, meInfo, location.pathname]);

  React.useEffect(() => {
    // Redirect to / if user is somewhere else than / and /login
    if (!['/', '/login'].includes(location.pathname) && me.loaded && !meInfo) {
      appHistory.reset(`/?redirect_uri=${location.pathname}`, history);
    }
  }, [me.loaded, meInfo, location.pathname]);

  return null;
};

export default HistoryListener;
