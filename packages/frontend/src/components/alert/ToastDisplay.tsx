import { Info24Regular, Warning24Regular, ErrorCircle24Regular } from '@fluentui/react-icons';
import React from 'react';

import { Toast, ToastType } from '../../recoil/toast';
import { mergeClassNames } from '../../utils/style';

import styles from './ToastDisplay.module.css';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => (
  <div
    className={mergeClassNames(
      'w-full rounded-md bg-white shadow-button flex p-2 overflow-hidden',
      styles.toastItem,
    )}
  >
    <div
      className={mergeClassNames(
        {
          [ToastType.INFO]: 'bg-blue-500',
          [ToastType.WARN]: 'bg-yellow-500',
          [ToastType.ERROR]: 'bg-red-500',
        }[toast.type],
        'w-1 rounded-full mr-4',
      )}
    />
    <div
      className={mergeClassNames(
        'w-auto flex break-all items-center',
      )}
      style={{ maxWidth: 'calc(100% - 56px)', minHeight: 40, verticalAlign: 'middle' }}
    >
      <div
        className={mergeClassNames(
          {
            [ToastType.INFO]: 'text-blue-500',
            [ToastType.WARN]: 'text-yellow-500',
            [ToastType.ERROR]: 'text-red-500',
          }[toast.type],
          'w-8 flex items-center mr-2',
        )}
      >
        {toast.type === ToastType.INFO && <Info24Regular className="stroke-current" />}
        {toast.type === ToastType.WARN && <Warning24Regular className="stroke-current" />}
        {toast.type === ToastType.ERROR && <ErrorCircle24Regular className="stroke-current" />}
      </div>
      {toast.message}
    </div>
  </div>
);

interface Props {
  toasts: Toast[];
}

const ToastDisplay: React.FC<Props> = ({ toasts }) => (
  <div
    className="h-fit max-w-md fixed z-toast flex flex-col-reverse top-2 right-4 pointer-events-none select-none"
    style={{ width: 'calc(100% - 32px)' }}
  >
    {toasts.map((toast) => (
      <ToastItem key={toast.sentAt.getTime()} toast={toast} />
    ))}
  </div>
);

export default ToastDisplay;
