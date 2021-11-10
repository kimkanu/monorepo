import { ReactElement } from 'react';
import { atom } from 'recoil';

interface DropdownState {
  element?: ReactElement;
  onClose?: () => void;
}

const dropdownAtom = atom<DropdownState>({
  key: 'dropdownAtom',
  default: {},
});

export default dropdownAtom;
