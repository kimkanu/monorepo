import React from 'react';
import {
  useLocation, useHistory,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import classroomState from '../recoil/classroom';

const Classroom: React.FC = () => {
  const classroom = useRecoilValue(classroomState.atom);
  const history = useHistory();

  React.useEffect(() => {
    if (classroom) {
      history.replace(`/classrooms/${classroom.hash}`);
    }
  }, [classroom?.hash]);

  return (
    <>
    </>
  );
};

export default Classroom;
