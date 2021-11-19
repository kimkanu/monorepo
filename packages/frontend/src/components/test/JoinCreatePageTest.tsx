/* istanbul ignore file */
import React from 'react';

import { Classroom } from '../../types/classroom';
import ClassList from '../classroom/ClassList';

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

const initialClassrooms: Classroom[] = [
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

const JoinCreatePageTest: React.FC = () => {
  const [classrooms] = React.useState(initialClassrooms);
  return (
    <div className="w-full h-full justify-center items-center">
      <ClassList classrooms={classrooms} />
    </div>
  );
};

export default JoinCreatePageTest;
