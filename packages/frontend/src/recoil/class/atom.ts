import { atom } from 'recoil';

export interface ClassState {
  id: string;
  name: string;
  videoId: string | null;
}

const classAtom = atom<ClassState | null>({
  key: 'classAtom',
  default: null,
});

export default classAtom;
