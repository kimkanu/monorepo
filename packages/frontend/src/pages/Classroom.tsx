import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import classroomsState from '../recoil/classrooms';

const Classroom: React.FC = () => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const history = useHistory();

  React.useEffect(() => {
    if (classrooms[0]) {
      history.replace(`/classrooms/${classrooms[0].hash}`);
    }
  }, [classrooms]);

  return (
    <>
    </>
  );
};

export default Classroom;
