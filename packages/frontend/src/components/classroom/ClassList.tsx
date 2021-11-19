import React from 'react';

import { Classroom } from '../../types/classroom';

import ClassAddButton from './ClassAddButton';
import ClassButton from './ClassButton';
import styles from './ClassList.module.css';

interface Props {
  classrooms: Classroom[];
}

const ClassList: React.FC<Props> = ({ classrooms }) => (
  <ul className={styles.container}>
    {classrooms.map((classroom) => (
      <li key={classroom.hash}>
        <ClassButton
          classroom={classroom}
        />
      </li>
    ))}
    <li>
      <ClassAddButton />
    </li>
  </ul>
);

export default ClassList;
