import { ReactElement } from 'react';
import { atom } from 'recoil';

interface DropdownState {
  element?: ReactElement;
  visible: boolean;
  onClose?: () => void;
}

const dropdownAtom = atom<DropdownState>({
  key: 'dropdownAtom',
  default: {
    visible: false,
  },
});

export default dropdownAtom;
