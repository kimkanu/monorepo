import React from 'react';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';

interface ClassInfo {
  courseName: string;
  live: boolean;
  my: boolean;
}

interface Props {
  classInfos: ClassInfo[];
}

const ClassList: React.FC<Props> = ({ classInfos }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 m-8">
    {classInfos.map((classInfo) => (
      <ClassButton
        courseName={classInfo.courseName}
        live={classInfo.live}
        my={classInfo.my}
      />
    ))}
    <li>
      <ClassAddButton />
    </li>
  </ul>
);

export default ClassList;
