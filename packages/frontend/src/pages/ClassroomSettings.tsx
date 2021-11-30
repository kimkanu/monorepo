import { ClassroomJSON, ClassroomsHashPatchResponse } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassroomSettingsContent from '../components/classroom/ClassroomSettingsContent';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';
import appHistory, { classroomPrefixRegex } from '../utils/history';

const ClassroomSettings: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const hash = location.pathname.match(classroomPrefixRegex)?.[1] ?? null;
  const isVisible = /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/settings/.test(location.pathname);

  const me = useRecoilValue(meState.atom);
  const myId = useRecoilValue(meState.id);
  const addToast = useSetRecoilState(toastState.new);
  const [classroom, setClassroom] = useRecoilState(classroomsState.byHash(hash));
  const [classroomName, setClassroomName] = React.useState<string | null>(classroom?.name ?? null);
  const [isPasscodeChanging, setPasscodeChanging] = React.useState(false);

  React.useEffect(() => {
    if (classroomName === null) {
      setClassroomName(classroom?.name ?? null);
    }
  }, [classroom]);

  React.useEffect(() => {
    if (!hash) {
      setClassroomName(null);
    }
  }, [hash]);

  return (
    <Dialog
      visible={me.loaded && !!me.info && isVisible}
      onClose={() => appHistory.goBack(history)}
    >
      {!!classroom && (
        <ClassroomSettingsContent
          isInstructor={classroom.instructorId === myId}
          classroom={classroom as ClassroomJSON}
          classroomName={classroomName ?? ''}
          onInputClassroomName={setClassroomName}
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
          isPasscodeChanging={isPasscodeChanging}
          onResetPasscode={async () => {
            if (!classroom.hash) return;

            setPasscodeChanging(true);

            const response = await fetchAPI('PATCH /classrooms/:hash', { hash: classroom.hash }, {
              operation: 'reset_passcode',
            }) as ClassroomsHashPatchResponse<'reset_passcode'>;

            if (response.success) {
              setClassroom({
                passcode: response.payload.passcode,
              });
            }

            setPasscodeChanging(false);
          }}
        />
      )}
    </Dialog>
  );
};

export default ClassroomSettings;
