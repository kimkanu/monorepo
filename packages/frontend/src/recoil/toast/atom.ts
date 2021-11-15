import { atom } from 'recoil';

export enum ToastType {
  INFO,
  WARN,
  ERROR,
}

export interface Toast {
  type: ToastType;
  message: string;
  sentAt: Date;
}

const toastAtom = atom<Toast[]>({
  key: 'toastAtom',
  default: [],
});

export default toastAtom;
