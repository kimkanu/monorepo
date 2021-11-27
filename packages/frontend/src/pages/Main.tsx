import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import ClassList from '../components/classroom/ClassList';
import Title from '../components/elements/Title';
import ContentPadding from '../components/layout/ContentPadding';
import classroomsState from '../recoil/classrooms';
import meState from '../recoil/me';

const Main = React.forwardRef<HTMLDivElement>((props, ref) => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const me = useRecoilValue(meState.atom);
  const history = useHistory();

  return (
    <ContentPadding ref={ref} isFooterPresent>
      {!me.loaded ? null : me.info ? (
        <>
          <Title size="title">내 수업</Title>
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
          <Title size="title">로그인 해주세요!</Title>
        </>
      )}
    </ContentPadding>
  );
});

export default Main;
