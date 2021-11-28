import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassList from '../components/classroom/ClassList';
import JoinCreateContent from '../components/classroom/JoinCreateContent';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';
import appHistory from '../utils/history';

const ClassroomMembers: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const addClassroom = useSetRecoilState(classroomsState.new);
  const addToast = useSetRecoilState(toastState.new);
  const location = useLocation();
  const history = useHistory();

  const hash = location.pathname.match(/^\/classrooms\/(\w{3}-\w{3}-\w{3})\/members\/?$/)?.[1] ?? null;

  return (
    <Dialog
      visible={me.loaded && !!me.info && !!hash}
      onClose={() => appHistory.goBack(history)}
    >
      dialog
    </Dialog>
  );
};

export default ClassroomMembers;
