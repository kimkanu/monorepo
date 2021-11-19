import { atom } from 'recoil';

import { Classroom } from '../../types/classroom';

const classroomAtom = atom<Classroom | null>({
  key: 'classroomAtom',
  default: null,
});

export default classroomAtom;
