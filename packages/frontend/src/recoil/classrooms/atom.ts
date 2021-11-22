import { ClassroomJSON } from '@team-10/lib';
import { atom } from 'recoil';

const classroomsAtom = atom<ClassroomJSON[]>({
  key: 'classroomsAtom',
  default: [],
});

export default classroomsAtom;
