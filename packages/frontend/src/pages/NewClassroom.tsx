import { ClassroomJSON, ClassroomsHashPatchResponse, ClassroomsHashPatchResponsePayload } from '@team-10/lib';
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

const NewClassroom: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const addClassroom = useSetRecoilState(classroomsState.new);
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const addToast = useSetRecoilState(toastState.new);
  const location = useLocation();
  const history = useHistory();

  const [isLoadingJoin, setLoadingJoin] = React.useState(false);
  const [isLoadingCreate, setLoadingCreate] = React.useState(false);

  return (
    <Dialog
      visible={me.loaded && !!me.info && /^\/classrooms\/new\/?$/.test(location.pathname)}
      onClose={() => history.replace('/')}
    >
      <JoinCreateContent
        onJoin={(hash, passcode) => {
          setLoadingJoin(true);
          fetchAPI('PATCH /classrooms/:hash', { hash }, { operation: 'join', passcode })
            .then((response_) => {
              const response = response_ as ClassroomsHashPatchResponse<'join'>;
              if (response.success) {
                addClassroom(response.payload);
                setMainClassroomHash(response.payload.hash);
                history.replace('/');
                setTimeout(() => {
                  history.push(`/classrooms/${response.payload.hash}`);
                }, 10);
              } else {
                addToast({
                  sentAt: new Date(),
                  type: 'error',
                  message: `[${response.error.code}]`,
                });
              }
            })
            .finally(() => {
              setLoadingJoin(false);
            });
        }}
        onCreate={(name) => {
          setLoadingCreate(true);
          fetchAPI('POST /classrooms', {}, { name })
            .then((response) => {
              if (response.success) {
                console.log('POST /classrooms', response.payload);
                addClassroom(response.payload);
                setMainClassroomHash(response.payload.hash);
                history.replace('/');
                setTimeout(() => {
                  history.push(`/classrooms/${response.payload.hash}`);
                }, 10);
              } else {
                addToast({
                  sentAt: new Date(),
                  type: 'error',
                  message: `[${response.error.code}] ${response.error.extra?.details ?? ''}`,
                });
              }
            })
            .finally(() => {
              setLoadingCreate(false);
            });
        }}
        isLoadingJoin={isLoadingJoin}
        isLoadingCreate={isLoadingCreate}
      />
    </Dialog>
  );
};

export default NewClassroom;
