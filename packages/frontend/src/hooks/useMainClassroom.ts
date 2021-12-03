import { ClassroomJSONWithSpeaker } from '@team-10/lib';
import { useRecoilValue } from 'recoil';

import classroomsState from '../recoil/classrooms';
import mainClassroomHashState from '../recoil/mainClassroomHash';

export default function useMainClassroom(): ClassroomJSONWithSpeaker | null {
  const classrooms = useRecoilValue(classroomsState.atom);
  const mainClassroomHash = useRecoilValue(mainClassroomHashState.atom);

  if (mainClassroomHash === null) return null;
  const mainClassroom = classrooms.find((c) => c.hash === mainClassroomHash) ?? null;
  return mainClassroom;
}
