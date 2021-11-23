import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';
import meState from '../recoil/me';

interface Props {
  hash: string;
}

const Classroom: React.FC<Props> = ({ hash }) => {
  const classrooms = useRecoilValue(classroomsState.atom);
  const setMainClassroomHash = useSetRecoilState(mainClassroomHashState.atom);
  const me = useRecoilValue(meState.atom);
  const history = useHistory();

  React.useEffect(() => {
    if (me.loaded) {
      if (me.info) {
        const classroom = classrooms.find((c) => c.hash === hash);
        if (!classroom) {
          if (history.length > 0) {
            history.goBack();
          } else {
            history.replace('/');
          }
        } else {
          setMainClassroomHash(hash);
        }
      } else {
        history.replace(`/login?redirect_uri=/classrooms/${hash}`);
      }
    }
  }, [me, classrooms]);

  return (
    <>
    </>
  );
};

export default Classroom;
