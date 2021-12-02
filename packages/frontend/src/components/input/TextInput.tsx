import { Checkmark20Regular, Dismiss20Regular, SpinnerIos20Regular } from '@fluentui/react-icons';
import CancelablePromise, { cancelable } from 'cancelable-promise';
import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../../utils/style';
import buttonStyles from '../buttons/Button.module.css';

import styles from './TextInput.module.css';

type ValidationError = string | null;
type Validator =
  | ((value: string | null) => boolean)
  | ((value: string | null) => ValidationError)
  | ((value: string | null) => Promise<boolean>)
  | ((value: string | null) => CancelablePromise<boolean>)
  | ((value: string | null) => Promise<ValidationError>)
  | ((value: string | null) => CancelablePromise<ValidationError>);

interface Props {
  value: string | null;
  onInput?: (newText: string, event: React.FormEvent<HTMLInputElement>) => void;
  icon?: React.ReactElement | null; // `20Regular`
  filled?: boolean;
  type?: 'text' | 'password';
  name?: string;
  autoComplete?: string;
  readOnly?: boolean;
  font?: 'sans' | 'mono';
  placeholderText?: string;
  align?: 'left' | 'center' | 'right';
  button?: React.ReactElement; // of height 48
  onSubmit?: (value: string) => void;
  validator?: Validator;
  nextRef?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement>;
  ref_?: React.RefObject<HTMLInputElement>
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
}

const TextInput: React.FC<Styled<Props>> = ({
  value,
  onInput,
  icon,
  filled = false,
  type = 'text',
  name,
  autoComplete = name,
  readOnly = false,
  font = 'sans',
  placeholderText,
  align = 'left',
  button,
  onSubmit,
  validator,
  nextRef,
  ref_,
  style,
  className,
  containerStyle,
  containerClassName,
}) => {
  const buttonWrapperRef = React.useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState(0);

  React.useEffect(() => {
    setButtonWidth(button ? buttonWrapperRef.current?.clientWidth ?? 0 : 0);
  }, [button, validator, buttonWrapperRef.current, buttonWrapperRef.current?.clientWidth]);

  const paddingRightButton = buttonWidth;
  const paddingRightValidation = validator ? 28 : 0;
  const paddingRight = 20 + paddingRightValidation + paddingRightButton;

  const [isValid, setValid] = React.useState<true | false | null>(null);
  const [error, setError] = React.useState<ValidationError>(null);
  React.useEffect(() => {
    if (!validator) return () => {};
    setValid(null);

    const promiseValid = validator(value);
    if (!(promiseValid instanceof Promise || promiseValid instanceof CancelablePromise)) {
      if (typeof promiseValid === 'boolean') {
        setValid(promiseValid);
        setError(null);
      } else {
        setValid(promiseValid === null);
        setError(promiseValid);
      }

      return () => {};
    }
    const cancelablePromise = promiseValid instanceof CancelablePromise
      ? promiseValid
      : cancelable<boolean | ValidationError>(promiseValid);
    cancelablePromise.then((v) => {
      if (typeof v === 'boolean') {
        setValid(v);
        setError(null);
      } else {
        setValid(v === null);
        setError(v);
      }
    });

    return () => {
      cancelablePromise.cancel();
    };
  }, [value]);

  return (
    <div
      style={containerStyle}
      className={mergeClassNames(
        containerClassName,
        'relative w-full h-12',
        isValid !== false ? styles.focusWithin : styles.focusWithinInvalid,
        isValid !== false ? 'text-gray-500' : 'text-red-300',
        buttonStyles.input,
      )}
    >
      {icon && (
        <div className={mergeClassNames(
          'absolute left-5 top-3.5 select-none pointer-events-none',
          filled ? null : styles.icon,
        )}
        >
          {icon}
        </div>
      )}
      <input
        ref={ref_}
        type={type}
        name={name ?? (type === 'password' ? 'password' : undefined)}
        autoComplete={autoComplete ?? (type === 'password' ? 'password' : undefined)}
        style={mergeStyles(
          {
            '--tw-ring-color': isValid !== false ? 'currentColor' : '#F5323C',
            textAlign: align,
            paddingRight,
          } as React.CSSProperties,
          style,
        )}
        className={mergeClassNames(
          'text-gray-900 text-emph w-full h-full rounded-full placeholder-sans outline-none border-none focus:ring-2',
          isValid !== false ? 'bg-gray-200' : 'bg-red-100 bg-opacity-50',
          font === 'sans' ? 'font-sans' : 'font-mono',
          icon ? 'pl-14' : 'pl-5',
          className,
        )}
        placeholder={placeholderText}
        value={value ?? ''}
        onInput={(e) => {
          if (onInput) {
            onInput(e.currentTarget.value, e);
          }
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && (validator ? validator(value) : !!value)) {
            if (onSubmit) {
              onSubmit(value ?? '');
            }
            if (nextRef?.current) {
              nextRef.current.focus();
            }
          }
        }}
        readOnly={readOnly}
      />
      {button && (
        <div className="absolute right-0 top-0">
          <div className="w-fit h-fit" ref={buttonWrapperRef}>
            {button}
          </div>
        </div>
      )}
      {validator && (
        <div
          className={mergeClassNames(
            'absolute top-3.5 select-none pointer-events-none',
            isValid === true ? 'text-blue-500' : isValid === false ? 'text-red-500' : 'text-gray-500',
            styles.icon,
          )}
          style={{
            right: button ? 12 + paddingRightButton : 20,
          }}
        >
          {isValid === true ? <Checkmark20Regular /> : isValid === false ? <Dismiss20Regular /> : <SpinnerIos20Regular className="animate-spin block" style={{ height: 20 }} />}
        </div>
      )}
    </div>
  );
};

export default TextInput;
