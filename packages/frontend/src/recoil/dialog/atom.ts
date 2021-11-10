import { ReactElement } from 'react';
import { atom } from 'recoil';

interface DialogState {
  element?: ReactElement;
  onClose?: () => void;
}

const dialogAtom = atom<DialogState>({
  key: 'dialogAtom',
  default: {},
});

export default dialogAtom;
