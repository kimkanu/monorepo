import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassList from '../components/classroom/ClassList';
import JoinCreateContent from '../components/classroom/JoinCreateContent';
import ContentPadding from '../components/layout/ContentPadding';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';

const Main: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const addClassroom = useSetRecoilState(classroomsState.new);
  const location = useLocation();
  const history = useHistory();

  return (
    <>
      {/* Join or Create Class Dialog */}
      <Dialog
        visible={/^\/classrooms\/new\/?$/.test(location.pathname)}
        onClose={history.length > 0 ? history.goBack : () => history.replace('/')}
      >
        <JoinCreateContent
          onCreate={async (name) => {
            fetch('/api/classes', {
              method: 'POST',
              body: JSON.stringify({ name }),
              headers: { 'Content-Type': 'application/json' },
            })
              .then((response) => response.json())
              .then((response: { success: true; payload: ClassroomJSON }) => {
                addClassroom(response.payload);
              });
          }}
        />
      </Dialog>

      {/* Content */}
      <ContentPadding isFooterPresent>
        {me.loading ? null : me.info ? (
          <>
            <h1 className="py-16 text-title text-center font-bold">My Classes</h1>
            <ClassList
              userId={me.info.stringId}
              classrooms={classrooms}
              onClickAdd={() => history.push('/classrooms/new')}
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
