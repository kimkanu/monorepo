/* eslint-disable jsx-a11y/label-has-associated-control */
/* istanbul ignore file */
import React from 'react';

import { mergeClassNames } from '../../utils/style';

interface RadioInputProps {
  labelClassName?: string;
  inputClassName?: string;
  checked: boolean;
  text: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RadioInput: React.FC<RadioInputProps> = ({
  labelClassName, inputClassName, checked, text, onChange,
}) => (
  <label className={
      mergeClassNames(
        'inline-flex items-center mt-3 px-3 py-2 rounded-xl transition-all cursor-pointer',
        labelClassName,
      )
    }
  >
    <input
      type="radio"
      className={mergeClassNames('cursor-pointer form-radio h-5 w-5', inputClassName)}
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2 text-gray-700">{text}</span>
  </label>
);

export const CheckboxInput: React.FC<RadioInputProps> = ({
  labelClassName, inputClassName, checked, text, onChange,
}) => (
  <label
    className={
        mergeClassNames(
          'inline-flex items-center mt-3 px-3 py-2 rounded-xl transition-all cursor-pointer',
          labelClassName,
        )
      }
  >
    <input
      type="checkbox"
      className={mergeClassNames('cursor-pointer form-radio h-5 w-5', inputClassName)}
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2 text-gray-700">{text}</span>
  </label>
);
