import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Dialog from '../components/alert/Dialog';
import meState from '../recoil/me';
import appHistory from '../utils/history';

const ClassroomMembers: React.FC = () => {
  const me = useRecoilValue(meState.atom);
  const location = useLocation();
  const history = useHistory();

  const isVisible = /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/members\/?$/.test(location.pathname);

  return (
    <Dialog
      visible={me.loaded && !!me.info && isVisible}
      onClose={() => appHistory.goBack(history)}
    >
      dialog
    </Dialog>
  );
};

export default ClassroomMembers;
