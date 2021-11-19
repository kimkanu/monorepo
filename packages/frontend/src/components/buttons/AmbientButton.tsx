import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../../utils/style';

import styles from './AmbientButton.module.css';

interface Props {
  dark?: boolean;
  icon?: React.ReactElement;
  alt?: string;
  size?: number;
  filled?: boolean;
  onClick?: React.MouseEventHandler;
  isImageIcon?: boolean;
}

const AmbientButton: React.FC<Styled<Props>> = ({
  dark = false,
  icon,
  alt,
  size = 40,
  filled = false,
  isImageIcon = false,
  onClick,
  className,
  style,
}) => (
  <button
    type="button"
    className={mergeClassNames(
      'flex justify-center items-center transition rounded-full bg-transparent',
      dark ? 'text-white hover:bg-white hover:bg-opacity-25' : 'text-gray-700 hover:bg-gray-200',
      filled ? null : styles.filledIcon,
      isImageIcon ? styles.imageIcon : null,
      className,
    )}
    style={mergeStyles(
      {
        width: size,
        height: size,
        transitionProperty: 'background-color, border-color, color, fill, stroke',
      },
      style,
    )}
    onClick={onClick}
  >
    {icon}
    <span className="hidden" aria-hidden={false}>{alt}</span>
  </button>
);

export default AmbientButton;
