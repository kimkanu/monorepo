import { atom } from 'recoil';

import { MeInfo } from '../../types/user';

type MeState = {
  loaded: false;
} | {
  loaded: true;
  info: MeInfo | null;
};

const meAtom = atom<MeState>({
  key: 'meAtom',
  default: { loaded: false },
});

export default meAtom;
