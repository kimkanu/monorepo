import { ClassroomHash } from '@team-10/lib';
import { atom } from 'recoil';

const mainClassroomHashAtom = atom<ClassroomHash | null>({
  key: 'mainClassroomHashAtom',
  default: null,
});

export default mainClassroomHashAtom;
