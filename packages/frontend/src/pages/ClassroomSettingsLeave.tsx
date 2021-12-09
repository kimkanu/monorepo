import { ClassroomsHashPatchResponse } from '@team-10/lib';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

  const isInstructor = !!classroom && classroom.instructor!.stringId === myId;
  const isStudent = !!classroom && classroom.instructor!.stringId !== myId;
  const { t } = useTranslation('classroom');

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
          message: t('removed'),
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
          message: t('left'),
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
            {isInstructor ? t('confirmRemove') : t('confirmLeave')}
          </Title>
          <p className="py-6 text-emph" style={{ lineHeight: '160%', wordBreak: 'keep-all' }}>
            {isInstructor
              ? (
                <span>
                  {t('confirmRemoveDesc1')}
                  {' '}
                  <strong>{t('confirmRemoveDesc2')}</strong>
                  {' '}
                  {t('confirmRemoveDesc3')}
                </span>
              )
              : t('confirmLeaveDesc')}
          </p>
          <Button width="full" type="destructive" text={isInstructor ? t('remove') : t('leave')} onClick={onLeave} isLoading={isLoading} />
        </>
      )}
    </Dialog>
  );
};

export default ClassroomSettingsLeave;
