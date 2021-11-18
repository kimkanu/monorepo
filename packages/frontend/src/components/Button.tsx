import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../utils/style';

import styles from './Button.module.css';

interface Props {
  type: 'primary' | 'destructive' | 'neutral';
  disabled?: boolean;
  text?: string;
  width: 'full' | 'fit-content';
  height?: 36 | 48 | 56;
  icon?: React.ReactElement | null; // of `20Regular`
  onClick?: React.MouseEventHandler;
  ref_?: React.RefObject<HTMLButtonElement>;
}

const Button: React.FC<Styled<Props>> = ({
  type,
  disabled = false,
  text,
  width,
  height = 48,
  icon,
  onClick,
  ref_,
  className,
  style,
}) => (
  <button
    ref={ref_}
    type="button"
    className={mergeClassNames(
      'rounded-full outline-none flex items-center justify-center font-bold transition-button duration-button',
      // eslint-disable-next-line no-nested-ternary
      width === 'full'
        ? 'w-full'
        : text
          ? 'w-fit'
          : {
            36: 'w-9',
            48: 'w-12',
            56: 'w-14',
          }[height],
      {
        36: 'h-9 text-base',
        48: 'h-12 text-emph',
        56: 'h-14 text-sub',
      }[height],
      disabled
        ? styles.disabled
        : {
          primary: 'text-white bg-primary-500 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700 shadow-color-primary',
          destructive: 'text-white bg-red-500 hover:bg-red-500 focus:bg-red-500 active:bg-red-700 shadow-color-destructive',
          neutral: 'text-gray-800 bg-white hover:bg-white focus:bg-white active:bg-gray-200 shadow-color-neutral',
        }[type],
      disabled
        ? 'shadow-none hover:shadow-none focus:shadow-none active:shadow-none cursor-not-allowed'
        : 'shadow-button hover:shadow-button-hover focus:shadow-button-hover active:shadow-button cursor-pointer',
      className,
    )}
    style={mergeStyles(
      style,
      text ? {
        paddingLeft: { 36: 16, 48: 26, 56: 32 }[height],
        paddingRight: { 36: 16, 48: 26, 56: 32 }[height],
      } : null,
    )}
    onClick={disabled ? undefined : onClick}
  >
    {icon && (
      <div
        className="select-none pointer-events-none flex justify-center"
        style={{
          marginRight: text ? { 36: 10, 48: 12, 56: 16 }[height] : 0,
          width: { 36: 20, 48: 24, 56: 28 }[height],
        }}
      >
        <div style={{ transform: `scale(${{ 36: 20, 48: 24, 56: 28 }[height] * 5}%)` }} className={styles.icon}>
          {icon}
        </div>
      </div>
    )}
    <span>{text}</span>
  </button>
);

export default Button;
