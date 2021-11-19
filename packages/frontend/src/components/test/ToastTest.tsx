/* eslint-disable jsx-a11y/label-has-associated-control */
/* istanbul ignore file */
import { Chat20Regular, Add20Regular } from '@fluentui/react-icons';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import toastState, { ToastType } from '../../recoil/toast';
import TempButton from '../buttons/TempButton';

const ToastTest: React.FC = () => {
  const [toastType, setToastType] = React.useState<ToastType>(ToastType.INFO);
  const [message, setMessage] = React.useState<string>('');
  const setToast = useSetRecoilState(toastState.new);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center max-w-lg mx-auto">
      <div className="text-gray-700 mr-4 absolute left-5 top-3.5 select-none pointer-events-none">
        <Chat20Regular className="stroke-current" />
      </div>
      <input
        placeholder="Title"
        className="h-12 bg-gray-200 placeholder-gray-500 text-emph w-full pr-5 pl-14 rounded-full"
        value={message}
        onChange={(e) => {
          setMessage(e.currentTarget.value);
        }}
      />

      <div className="flex gap-8">
        <label className="inline-flex items-center mt-3 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-500"
            checked={toastType === ToastType.INFO}
            onChange={() => {
              setToastType(ToastType.INFO);
            }}
          />
          <span className="ml-2 text-gray-700">Info</span>
        </label>
        <label className="inline-flex items-center mt-3 hover:bg-yellow-100 px-3 py-2 rounded-xl transition-colors pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-yellow-500"
            checked={toastType === ToastType.WARN}
            onChange={() => {
              setToastType(ToastType.WARN);
            }}
          />
          <span className="ml-2 text-gray-700">Warn</span>
        </label>
        <label className="inline-flex items-center mt-3 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors pointer">
          <input
            type="radio"
            className="form-radio h-5 w-5 text-red-500"
            checked={toastType === ToastType.ERROR}
            onChange={() => {
              setToastType(ToastType.ERROR);
            }}
          />
          <span className="ml-2 text-gray-700">Error</span>
        </label>
      </div>

      <TempButton
        width="fit"
        label="Add Toast"
        icon={<Add20Regular className="stroke-current" />}
        onClick={() => {
          setToast({
            sentAt: new Date(),
            type: toastType,
            message,
          });
        }}
      />
    </div>
  );
};

export default ToastTest;
