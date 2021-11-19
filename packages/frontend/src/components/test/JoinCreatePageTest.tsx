/* istanbul ignore file */
import React from 'react';

import ClassList from '../ClassList';

interface ClassInfo {
  courseName: string;
  live: boolean;
  my: boolean;
  background?: React.CSSProperties;
}

const classinfo: ClassInfo[] = [
  {
    courseName: '전산학특강<FE개발>',
    live: true,
    my: true,
    background: { backgroundColor: '#FF6492' },
  },
  {
    courseName: '컴퓨터 시스템',
    live: true,
    my: false,
  },
  {
    courseName: '알고리즘 개론',
    live: false,
    my: false,
  },
  {
    courseName: '전산기조직',
    live: false,
    my: true,
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
