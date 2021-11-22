import React from 'react';

import { Classroom } from '../../types/classroom';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';
import styles from './ClassList.module.css';

interface Props {
  classrooms: Classroom[];
  onClickAdd?: React.MouseEventHandler;
}

const ClassList: React.FC<Props> = ({ classrooms, onClickAdd }) => (
  <ul className={styles.container}>
    {classrooms.map((classroom) => (
      <li key={classroom.hash}>
        <ClassButton
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
