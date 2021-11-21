import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Dialog from '../components/alert/Dialog';
import ClassList from '../components/classroom/ClassList';
import JoinCreateContent from '../components/classroom/JoinCreateContent';
import ContentPadding from '../components/layout/ContentPadding';
import classroomState from '../recoil/classroom';
import { Classroom } from '../types/classroom';

function generateClassroomHash(): string {
  const generateSyllable = (): string => {
    const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const first = ['B', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'S', 'T'];
    const second = ['A', 'E', 'I', 'O', 'U'];
    const third = ['K', 'L', 'M', 'N', 'P', 'S', 'T', 'Z'];

    return `${random(first)}${random(second)}${random(third)}`;
  };

  return `${generateSyllable()}-${generateSyllable()}-${generateSyllable()}`;
}

const classrooms: Classroom[] = [
  {
    name: '전산학특강<FE개발>',
    isLive: true,
    isMine: true,
    hash: generateClassroomHash(),
    videoId: null,
  },
  {
    name: '컴퓨터 시스템',
    isLive: true,
    isMine: false,
    hash: generateClassroomHash(),
    videoId: null,
  },
  {
    name: '알고리즘 개론',
    isLive: false,
    isMine: false,
    hash: generateClassroomHash(),
    videoId: null,
  },
  {
    name: '전산기조직',
    isLive: false,
    isMine: true,
    hash: generateClassroomHash(),
    videoId: null,
  },
];

const Main: React.FC = () => {
  const classroom = useRecoilValue(classroomState.atom);
  const location = useLocation();
  const history = useHistory();

  return (
    <>
      <>
        {/* Join or Create Class Dialog */}
        <Dialog
          visible={/^\/classrooms\/new\/?$/.test(location.pathname)}
          onClose={history.length > 0 ? history.goBack : () => history.replace('/')}
        >
          <JoinCreateContent />
        </Dialog>

        {/* Content */}
        <ContentPadding isFooterPresent>
          <h1 className="py-16 text-title text-center font-bold">My Classes</h1>
          <ClassList classrooms={classrooms} onClickAdd={() => history.push('/classrooms/new')} />
          <div className="transition-all duration-300" style={{ height: classroom?.videoId ? 152 : 64 }} />
        </ContentPadding>
      </>
    </>
  );
};

export default Main;
