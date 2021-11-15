/* istanbul ignore file */
import { selector } from 'recoil';

import { guardRecoilDefaultValue } from '..';

import toastAtom, { Toast } from './atom';

const TOAST_MILLIS = 5000;

const toastNewSelector = selector<Toast | null>({
  key: 'toastVisibleSelector',
  get: ({ get }) => {
    // returns last toast message
    const toasts = get(toastAtom);
    return toasts.slice(-1)[0] ?? null;
  },
  set: ({ set }, newToast) => {
    if (guardRecoilDefaultValue(newToast)) return;
    if (newToast === null || !newToast.message) return;
    set(toastAtom, (toasts) => {
      console.log([
        ...toasts.filter((toast) => Date.now() - toast.sentAt.getTime() < TOAST_MILLIS),
        newToast,
      ]);
      return [
        ...toasts.filter((toast) => Date.now() - toast.sentAt.getTime() < TOAST_MILLIS),
        newToast,
      ];
    });
  },
});

export default toastNewSelector;
