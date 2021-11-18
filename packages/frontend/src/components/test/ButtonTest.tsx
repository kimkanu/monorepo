/* eslint-disable jsx-a11y/label-has-associated-control */
/* istanbul ignore file */
import { ArrowCounterclockwise20Regular, SpinnerIos20Regular } from '@fluentui/react-icons';
import React from 'react';
import { useRecoilState } from 'recoil';

import themeState from '../../recoil/theme';
import { mergeClassNames } from '../../utils/style';
import Button from '../Button';

interface RadioInputProps {
  labelClassName?: string;
  inputClassName?: string;
  checked: boolean;
  text: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const RadioInput: React.FC<RadioInputProps> = ({
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

const CheckboxInput: React.FC<RadioInputProps> = ({
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

const ButtonTest: React.FC = () => {
  const [theme, setTheme] = useRecoilState(themeState.atom);
  const [color, setColor] = React.useState<'primary' | 'destructive' | 'neutral'>('primary');
  const [icon, setIcon] = React.useState<number>(0);
  const [height, setHeight] = React.useState<36 | 48 | 56>(48);
  const [disabled, setDisabled] = React.useState(false);
  const [full, setFull] = React.useState(false);
  const [text, setText] = React.useState(false);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex gap-8 w-fit">
        <RadioInput inputClassName="text-violet-700" labelClassName="hover:bg-violet-100" checked={theme === 'violet'} text="Violet" onChange={() => setTheme('violet')} />
        <RadioInput inputClassName="text-pink-700" labelClassName="hover:bg-pink-100" checked={theme === 'pink'} text="Pink" onChange={() => setTheme('pink')} />
        <RadioInput inputClassName="text-green-700" labelClassName="hover:bg-green-100" checked={theme === 'green'} text="Green" onChange={() => setTheme('green')} />
        <RadioInput inputClassName="text-blue-700" labelClassName="hover:bg-blue-100" checked={theme === 'blue'} text="Blue" onChange={() => setTheme('blue')} />
      </div>
      <div className="flex gap-8 w-fit">
        <RadioInput inputClassName="text-primary-700" labelClassName="hover:bg-primary-100" checked={color === 'primary'} text="Primary" onChange={() => setColor('primary')} />
        <RadioInput inputClassName="text-red-700" labelClassName="hover:bg-red-100" checked={color === 'destructive'} text="Destructive" onChange={() => setColor('destructive')} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={color === 'neutral'} text="Neutral" onChange={() => setColor('neutral')} />
      </div>
      <div className="flex gap-8 w-fit">
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 0} text="None" onChange={() => setIcon(0)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 1} text="Reset" onChange={() => setIcon(1)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={icon === 2} text="Loading" onChange={() => setIcon(2)} />
      </div>
      <div className="flex gap-8 w-fit">
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={height === 36} text="36" onChange={() => setHeight(36)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={height === 48} text="48" onChange={() => setHeight(48)} />
        <RadioInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={height === 56} text="56" onChange={() => setHeight(56)} />
      </div>
      <div className="flex gap-8 w-fit mb-12">
        <CheckboxInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={!disabled} text={disabled ? 'Disabled' : 'Enabled'} onChange={() => setDisabled((d) => !d)} />
        <CheckboxInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={text} text={text ? 'With Text' : 'W/O Text'} onChange={() => setText((t) => !t)} />
        <CheckboxInput inputClassName="text-gray-700" labelClassName="hover:bg-gray-200" checked={full} text={full ? 'Full' : 'Fit'} onChange={() => setFull((t) => !t)} />
      </div>
      <div className="px-12 w-full max-w-sm h-14 flex justify-center items-center">
        <Button
          type={color}
          disabled={disabled}
          width={full ? 'full' : 'fit-content'}
          height={height}
          text={!text ? '' : {
            0: 'Noop',
            1: 'Reset',
            2: 'Loading...',
          }[icon]}
          icon={{
            0: null,
            1: <ArrowCounterclockwise20Regular />,
            2: <SpinnerIos20Regular className="animate-spin block" style={{ height: 20 }} />,
          }[icon]}
        />
      </div>
    </div>
  );
};

export default ButtonTest;
