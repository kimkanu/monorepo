import { ClassroomJSONWithSpeaker } from '@team-10/lib';
import { atom } from 'recoil';

const classroomsAtom = atom<ClassroomJSONWithSpeaker[]>({
  key: 'classroomsAtom',
  default: [],
});

export default classroomsAtom;
