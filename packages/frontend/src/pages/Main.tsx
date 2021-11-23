import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassList from '../components/classroom/ClassList';
import JoinCreateContent from '../components/classroom/JoinCreateContent';
import ContentPadding from '../components/layout/ContentPadding';
import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';
import fetchAPI from '../utils/fetch';

const Main: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const addClassroom = useSetRecoilState(classroomsState.new);
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const location = useLocation();
  const history = useHistory();

  const [isLoadingJoin, setLoadingJoin] = React.useState(false);
  const [isLoadingCreate, setLoadingCreate] = React.useState(false);

  return (
    <>
      {/* Join or Create Class Dialog */}
      <Dialog
        visible={me.loaded && !!me.info && /^\/classrooms\/new\/?$/.test(location.pathname)}
        onClose={() => history.replace('/')}
      >
        <JoinCreateContent
          onJoin={(hash, passcode) => {
            setLoadingJoin(true);
            fetchAPI('PATCH /classrooms/:hash', { hash }, { operation: 'join', passcode })
              .then((response) => {
                if (response.success) {
                  addClassroom(response.payload);
                  setMainClassroomHash(response.payload.hash);
                  history.replace('/');
                  history.push(`/classrooms/${response.payload.hash}`);

                  console.log('Join suceeded');
                } else {
                  // TODO: show a toast
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
                  addClassroom(response.payload);
                  setMainClassroomHash(response.payload.hash);
                  history.replace('/');
                  history.push(`/classrooms/${response.payload.hash}`);

                  console.log('Creation suceeded');
                } else {
                  // TODO: show a toast
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

      {/* Content */}
      <ContentPadding isFooterPresent>
        {!me.loaded ? null : me.info ? (
          <>
            <h1 className="py-16 text-title text-center font-bold">My Classes</h1>
            <ClassList
              userId={me.info.stringId}
              classrooms={classrooms}
              onClickClassroom={(classroom) => history.push(`/classrooms/${classroom.hash}`)}
              onJoinOrCreate={() => history.push('/classrooms/new')}
            />
            <div className="transition-all duration-300" style={{ height: classrooms[0]?.video ? 152 : 64 }} />
          </>
        ) : (
          <>
            <h1 className="py-16 text-title text-center font-bold">로그인 해주세요!</h1>
          </>
        )}
      </ContentPadding>
    </>
  );
};

export default Main;
