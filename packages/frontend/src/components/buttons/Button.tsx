import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../../utils/style';

import styles from './Button.module.css';

interface Props {
  type: 'primary' | 'destructive' | 'neutral';
  disabled?: boolean;
  text?: string;
  width: 'full' | 'fit-content';
  height?: 36 | 48 | 56;
  icon?: React.ReactElement | null; // of `20Regular`
  filled?: boolean;
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
  filled = false,
  onClick,
  ref_,
  className,
  style,
}) => {
  const [pressedByKey, setPressedByKey] = React.useState(false);
  return (
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
          : mergeClassNames(pressedByKey ? styles.pressed : styles.released, styles[type], `shadow-color-${type}`),
        disabled
          ? 'shadow-none hover:shadow-none focus:shadow-none active:shadow-none cursor-not-allowed'
          : '',
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
      onKeyDown={(e) => {
        console.log('keydown', e.key);
        if (e.key === 'Enter') {
          setPressedByKey(true);
        }
      }}
      onKeyUp={(e) => {
        console.log('keyup', e.key);
        setPressedByKey(false);
      }}
    >
      {icon && (
      <div
        className="select-none pointer-events-none flex justify-center"
        style={{
          marginRight: text ? { 36: 10, 48: 12, 56: 16 }[height] : 0,
          width: { 36: 20, 48: 24, 56: 28 }[height],
        }}
      >
        <div
          style={{ transform: `scale(${{ 36: 20, 48: 24, 56: 28 }[height] * 5}%)` }}
          className={filled ? undefined : styles.filledIcon}
        >
          {icon}
        </div>
      </div>
      )}
      <span>{text}</span>
    </button>
  );
};

export default Button;
