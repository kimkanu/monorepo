import { SpinnerIos20Regular } from '@fluentui/react-icons';
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
  isLoading?: boolean | 'text' | 'icon' | 'both' | null;
}

const Button: React.FC<Styled<Props>> = ({
  type,
  disabled = false,
  text: text_,
  width,
  height = 48,
  icon: icon_,
  filled: filled_ = false,
  onClick,
  ref_,
  className,
  style,
  isLoading: isLoading_ = null,
}) => {
  const [pressedByKey, setPressedByKey] = React.useState(false);

  const isLoading = isLoading_ === true ? 'icon' : isLoading_ === false ? null : isLoading_;

  // isLoading override
  const icon = isLoading === null
    ? icon_
    : isLoading === 'text'
      ? null
      : <SpinnerIos20Regular className="animate-spin block" style={{ height: 20 }} />;

  const filled = isLoading === null ? filled_ : false;

  const text = isLoading === null
    ? text_
    : isLoading === 'icon'
      ? null
      : text_;

  return (
    <button
      ref={ref_}
      type="button"
      className={mergeClassNames(
        'rounded-full outline-none flex items-center justify-center font-bold transition-button duration-button',
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
        isLoading ? 'shadow-none hover:shadow-none focus:shadow-none active:shadow-none cursor-wait' : null,
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
      onClick={disabled || isLoading ? undefined : onClick}
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
            className={filled ? undefined : styles.icon}
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
