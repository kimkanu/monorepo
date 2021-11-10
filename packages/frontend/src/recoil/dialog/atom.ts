import { ReactElement } from 'react';
import { atom } from 'recoil';

interface DialogState {
  element?: ReactElement;
  visible: boolean;
  onClose?: () => void;
}

const dialogAtom = atom<DialogState>({
  key: 'dialogAtom',
  default: {
    visible: false,
  },
});

export default dialogAtom;
