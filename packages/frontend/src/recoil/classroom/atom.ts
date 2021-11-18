import { atom } from 'recoil';

export interface ClassroomState {
  id: string;
  name: string;
  videoId: string | null;
}

const classroomAtom = atom<ClassroomState | null>({
  key: 'classroomAtom',
  default: null,
});

export default classroomAtom;
