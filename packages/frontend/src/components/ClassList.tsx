import React from 'react';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';

interface ClassInfo {
  courseName: string;
  live: boolean;
  my: boolean;
  background?: React.CSSProperties;
}

interface Props {
  classInfos: ClassInfo[];
}

const ClassList: React.FC<Props> = ({ classInfos }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 m-8">
    {classInfos.map((classInfo) => (
      <ClassButton
        key={classInfo.courseName}
        courseName={classInfo.courseName}
        live={classInfo.live}
        my={classInfo.my}
        background={classInfo.background}
      />
    ))}
    <li>
      <ClassAddButton />
    </li>
  </ul>
);

export default ClassList;
