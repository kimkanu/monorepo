import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassroomSettingsContent from '../components/classroom/ClassroomSettingsContent';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';
import toastState from '../recoil/toast';

const ClassroomSettings: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const hash = location.pathname.match(/^\/classrooms\/(\w{3}-\w{3}-\w{3})\/settings\/?$/)?.[1] ?? null;

  const me = useRecoilValue(meState.atom);
  const myId = useRecoilValue(meState.id);
  const addToast = useSetRecoilState(toastState.new);
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));

  return (
    <Dialog
      visible={me.loaded && !!me.info && !!hash}
      onClose={() => (history.length > 0 ? history.goBack() : history.replace(`/classrooms/${hash}`))}
    >
      {!!classroom && (
        <ClassroomSettingsContent
          isInstructor={classroom.instructorId === myId}
          classroom={classroom as ClassroomJSON}
          onChangeClassroomName={(name) => {
            setClassroom({ name });
          }}
          onChangeClassroomNameError={(e) => {
            addToast({
              type: 'error',
              sentAt: new Date(),
              message: `[${e.code}] ${e.extra ?? ''}`,
            });
          }}
        />
      )}
    </Dialog>
  );
};

export default ClassroomSettings;
