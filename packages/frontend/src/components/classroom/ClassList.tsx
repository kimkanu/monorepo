import { ClassroomJSON } from '@team-10/lib';
import React from 'react';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';
import styles from './ClassList.module.css';

interface Props {
  userId: string;
  classrooms: ClassroomJSON[];
  onClickClassroom?: (classroom: ClassroomJSON) => void;
  onJoinOrCreate?: React.MouseEventHandler;
}

const ClassList: React.FC<Props> = ({
  userId, classrooms, onClickClassroom = () => {}, onJoinOrCreate,
}) => (
  <ul className={styles.container}>
    {classrooms.map((classroom) => (
      <li key={classroom.hash}>
        <ClassButton
          userId={userId}
          classroom={classroom}
          onClick={() => onClickClassroom(classroom)}
        />
      </li>
    ))}
    <li>
      <ClassAddButton onClick={onJoinOrCreate} />
    </li>
  </ul>
);

export default ClassList;
