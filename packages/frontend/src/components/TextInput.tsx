import { Checkmark20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../utils/style';

import buttonStyles from './Button.module.css';
import styles from './TextInput.module.css';

interface Props {
  value: string;
  onInput?: (newText: string) => void;
  icon?: React.ReactElement | null; // `20Regular`
  type?: 'text' | 'password';
  name?: string;
  autoComplete?: string;
  readOnly?: boolean;
  font?: 'sans' | 'mono';
  placeholderText?: string;
  align?: 'left' | 'center' | 'right';
  button?: React.ReactElement; // of height 48
  onSubmit?: (value: string) => void;
  validator?: (value: string) => boolean;
  nextRef?: React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement>;
  ref_?: React.RefObject<HTMLInputElement>
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
}

const TextInput: React.FC<Styled<Props>> = ({
  value,
  onInput,
  icon,
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

  const isValid = validator ? validator(value) : true;

  return (
    <div
      style={containerStyle}
      className={mergeClassNames(
        containerClassName,
        'relative w-full h-12',
        isValid ? styles.focusWithin : styles.focusWithinInvalid,
        isValid ? 'text-gray-500' : 'text-red-300',
        buttonStyles.input,
      )}
    >
      {icon && (
        <div className={mergeClassNames(
          'absolute left-5 top-3.5 select-none pointer-events-none',
          styles.icon,
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
            '--tw-ring-color': isValid ? 'currentColor' : '#F5323C',
            textAlign: align,
            paddingRight,
          } as React.CSSProperties,
          style,
        )}
        className={mergeClassNames(
          className,
          'text-gray-900 text-emph w-full h-full rounded-full placeholder-sans outline-none border-none focus:ring-2',
          isValid ? 'bg-gray-200' : 'bg-red-100 bg-opacity-50',
          font === 'sans' ? 'font-sans' : 'font-mono',
          icon ? 'pl-14' : 'pl-5',
        )}
        placeholder={placeholderText}
        value={value}
        onInput={(e) => {
          if (onInput) {
            onInput(e.currentTarget.value);
          }
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && (validator ? validator(value) : !!value)) {
            if (onSubmit) {
              onSubmit(value);
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
            isValid ? 'text-blue-500' : 'text-red-500',
            styles.icon,
          )}
          style={{
            right: button ? 12 + paddingRightButton : 20,
          }}
        >
          {isValid ? <Checkmark20Regular /> : <Dismiss20Regular />}
        </div>
      )}
    </div>
  );
};

export default TextInput;
