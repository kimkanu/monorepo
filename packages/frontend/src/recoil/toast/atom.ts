import { atom } from 'recoil';

export interface Toast {
  type: 'info' | 'warn' | 'error';
  message: string;
  sentAt: Date;
}

const toastAtom = atom<Toast[]>({
  key: 'toastAtom',
  default: [],
});

export default toastAtom;
