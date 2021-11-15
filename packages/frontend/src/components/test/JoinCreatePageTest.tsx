/* istanbul ignore file */
import React from 'react';

import ClassList from '../ClassList';

interface ClassInfo {
  courseName: string;
  live: boolean;
  my: boolean;
  background: string;
}

const classinfo: ClassInfo[] = [
  {
    courseName: '전산학특강<FE개발>',
    live: true,
    my: true,
    background: 'bg-pink-300',
  },
  {
    courseName: '컴퓨터 시스템',
    live: true,
    my: false,
    background: 'bg-pink-500',
  },
  {
    courseName: '알고리즘 개론',
    live: false,
    my: false,
    background: 'bg-primary-300',
  },
  {
    courseName: '전산기조직',
    live: false,
    my: true,
    background: 'bg-primary-500',
  },
];

const JoinCreatePageTest: React.FC = (
) => {
  const [classinfos, setClass] = React.useState(classinfo);
  return (
    <div className="w-full h-full justify-center items-center">
      <ClassList classInfos={classinfos} />
    </div>
  );
};

export default JoinCreatePageTest;
