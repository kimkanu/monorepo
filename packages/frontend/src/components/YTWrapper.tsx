import { FullScreenMaximize24Filled } from '@fluentui/react-icons';
import React from 'react';

import { mergeClassNames, mergeStyles, Styled } from '../utils/style';

interface YTMaximizationHintProps {
  onClick?: React.MouseEventHandler;
}

const YTMaximizationHint: React.FC<YTMaximizationHintProps> = ({ onClick }) => (
  <div
    className="group w-full h-full absolute z-40 opacity-0 hover:opacity-100 flex justify-center items-center transition-all duration-300"
    role="button"
    onClick={onClick}
    tabIndex={0}
    aria-hidden
  >
    <div className="w-full h-full absolute top-0 left-0 bg-black opacity-60" />
    <FullScreenMaximize24Filled primaryFill="white" className="opacity-100 z-50" />
  </div>
);

interface Props {
  inClass: boolean;
  onClick?: React.MouseEventHandler;
  maximizedClassName?: string;
  minimizedClassName?: string;
  maximizedStyle?: React.CSSProperties;
  minimizedStyle?: React.CSSProperties;
}

const YTWrapper: React.FC<Styled<Props>> = ({
  onClick, inClass, style, className,
  maximizedClassName = 'w-full h-full',
  minimizedClassName = 'w-64 h-36',
  maximizedStyle = {},
  minimizedStyle = {},
  children,
}) => (
  <div
    style={mergeStyles(
      style,
      inClass ? maximizedStyle : minimizedStyle,
    )}
    className={mergeClassNames(
      inClass ? maximizedClassName : minimizedClassName,
      className,
      'transition-all duration-500 relative rounded-lg overflow-hidden',
    )}
  >
    {!inClass && <YTMaximizationHint onClick={onClick} />}
    {children}
  </div>
);

export default YTWrapper;
