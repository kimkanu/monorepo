import React from 'react';

import ClassList from '../components/classroom/ClassList';
import ContentPadding from '../components/layout/ContentPadding';
import { Classroom } from '../types/classroom';

function generateClassroomHash(): string {
  const generateSyllable = (): string => {
    const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const first = ['B', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'S', 'T', 'W'];
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

const Main: React.FC = () => (
  <ContentPadding isFooterPresent>
    <ClassList classrooms={classrooms} />
  </ContentPadding>
);

export default Main;
