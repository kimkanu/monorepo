import { SSOAccountJSON, ClassroomJSON } from '@team-10/lib';
import React from 'react';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';
import styles from './ClassList.module.css';

interface Props {
  userId: string;
  classrooms: ClassroomJSON[];
  onClickAdd?: React.MouseEventHandler;
}

const ClassList: React.FC<Props> = ({ userId, classrooms, onClickAdd }) => (
  <ul className={styles.container}>
    {classrooms.map((classroom) => (
      <li key={classroom.hash}>
        <ClassButton
          userId={userId}
          classroom={classroom}
        />
      </li>
    ))}
    <li>
      <ClassAddButton onClick={onClickAdd} />
    </li>
  </ul>
);

export default ClassList;
