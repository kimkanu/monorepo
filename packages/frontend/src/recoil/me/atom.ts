import { atom } from 'recoil';

import { MeInfo } from '../../types/user';

type MeState = {
  loading: true;
} | {
  loading: false;
  info: MeInfo | null;
};

const meAtom = atom<MeState>({
  key: 'meAtom',
  default: { loading: true },
});

export default meAtom;
