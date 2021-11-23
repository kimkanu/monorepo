import { ClassroomJSON } from '@team-10/lib';
import React from 'react';
import { useRecoilValue } from 'recoil';

import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';

export default function useMainClassroom(): ClassroomJSON | null {
  const classrooms = useRecoilValue(classroomsState.atom);
  const mainClassroomHash = useRecoilValue(mainClassroomHashState.atom);

  if (mainClassroomHash === null) return null;
  const mainClassroom = classrooms.find((c) => c.hash === mainClassroomHash) ?? null;
  return mainClassroom;
}
