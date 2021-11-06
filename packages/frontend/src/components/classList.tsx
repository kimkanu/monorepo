import React from 'react';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';

interface ClassInfo {
  coursename: string;
  islive: boolean;
  ismine: boolean;
}

interface Props {
  classinfos: ClassInfo[];
}

const ClassList: React.FC<Props> = ({ classinfos }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 m-8">
    {classinfos.map((classinfo) => (
      <ClassButton
        courseName={classinfo.coursename}
        isLive={classinfo.islive}
        isMine={classinfo.ismine}
      />
    ))}
    <li>
      <ClassAddButton />
    </li>
  </ul>
);

export default ClassList;
