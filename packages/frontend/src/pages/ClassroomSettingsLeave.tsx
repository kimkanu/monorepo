import { ClassroomsHashPatchResponse } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import Button from '../components/buttons/Button';
import Title from '../components/elements/Title';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';
import toastState from '../recoil/toast';
import fetchAPI from '../utils/fetch';
import appHistory, { classroomPrefixRegex } from '../utils/history';

const ClassroomSettingsLeave: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const hash = location.pathname.match(classroomPrefixRegex)?.[1] ?? null;
  const isVisible = /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/settings\/(leave|remove)\/?$/.test(location.pathname);

  const me = useRecoilValue(meState.atom);
  const myId = useRecoilValue(meState.id);
  const addToast = useSetRecoilState(toastState.new);
  const setClassrooms = useSetRecoilState(classroomsState.atom);
  const classroom = useRecoilValue(classroomsState.byHash(hash));
  const [classroomName, setClassroomName] = React.useState<string | null>(classroom?.name ?? null);
  const [isLoading, setLoading] = React.useState(false);

  const isInstructor = !!classroom && classroom.instructorId === myId;
  const isStudent = !!classroom && classroom.instructorId !== myId;

  React.useEffect(() => {
    if (classroomName === null) {
      setClassroomName(classroom?.name ?? null);
    }
  }, [classroom]);

  React.useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!hash) {
      setClassroomName(null);
    }
  }, [hash]);

  React.useEffect(() => {
    if (isInstructor && /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/settings\/leave\/?$/.test(location.pathname)) {
      const pathname = location.pathname.replace('leave', 'remove');
      appHistory.replace(pathname, history);
    }
    if (isStudent && /^\/classrooms\/(\w{3}-\w{3}-\w{3})\/settings\/remove\/?$/.test(location.pathname)) {
      const pathname = location.pathname.replace('remove', 'leave');
      appHistory.replace(pathname, history);
    }
  }, [location.pathname, classroom]);

  const onLeave = async () => {
    if (!hash) return;

    setLoading(true);

    if (isInstructor) {
      const response = await fetchAPI('DELETE /classrooms/:hash', { hash });
      if (response.success) {
        addToast({
          type: 'info',
          sentAt: new Date(),
          message: '수업이 삭제되었습니다.',
        });
      } else {
        addToast({
          type: 'error',
          sentAt: new Date(),
          message: `[${response.error.code}]`,
        });
      }
    } else if (isStudent) {
      const response = await fetchAPI('PATCH /classrooms/:hash', { hash }, {
        operation: 'leave',
      }) as ClassroomsHashPatchResponse<'leave'>;
      if (response.success) {
        addToast({
          type: 'info',
          sentAt: new Date(),
          message: '수업에서 나갔습니다.',
        });
      } else {
        addToast({
          type: 'error',
          sentAt: new Date(),
          message: `[${response.error.code}]`,
        });
      }
    }

    appHistory.reset('/', history);
    setClassrooms((classrooms) => classrooms.filter((c) => c.hash !== hash));
  };

  return (
    <Dialog
      visible={me.loaded && !!me.info && !!isVisible}
      onClose={() => appHistory.goBack(history)}
      className="w-fit"
      style={{
        maxWidth: 'clamp(448px, 80vw, 540px)',
      }}
    >
      {!!classroom && (
        <>
          <Title size="sect" style={{ lineHeight: '120%', wordBreak: 'keep-all' }}>
            {isInstructor ? '정말 수업을 삭제하시겠습니까?' : '정말 수업에서 나가시겠습니까?'}
          </Title>
          <p className="py-6 text-emph" style={{ lineHeight: '160%', wordBreak: 'keep-all' }}>
            {isInstructor
              ? (
                <span>
                  수업의 학생 목록, 수업 기록, 채팅 등
                  {' '}
                  <strong>모든 정보가 삭제됩니다.</strong>
                  {' '}
                  계속하시겠습니까?
                </span>
              )
              : '수업 아이디와 비밀번호가 있다면 언제든지 다시 들어올 수 있습니다.'}
          </p>
          <Button width="full" type="destructive" text={isInstructor ? '수업 삭제하기' : '수업 나가기'} onClick={onLeave} isLoading={isLoading} />
        </>
      )}
    </Dialog>
  );
};

export default ClassroomSettingsLeave;
