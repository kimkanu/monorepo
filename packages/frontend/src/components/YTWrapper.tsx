import { FullScreenMaximize24Filled } from '@fluentui/react-icons';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import useScreenType, { ScreenType } from '../hooks/useScreenType';
import { mergeClassNames, Styled } from '../utils/style';

import styles from './YTWrapper.module.css';

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
  isPresent: boolean;
  inClass: boolean;
  onClick?: React.MouseEventHandler;
}

const YTWrapper: React.FC<Styled<Props>> = ({
  onClick, inClass, isPresent, style, className, children,
}) => {
  const TIMEOUT = 400;

  const [initialInClass, setInitialInClass] = React.useState(inClass);
  const screenType = useScreenType();
  const screenTypeName = ScreenType[screenType];

  // The following two `useEffect`s deal with delayed changes of
  // `inClass` variable, which is stored in `initialInClass`.
  // When the transition is completed, `initialInClass` is set
  // to be the same with `inClass`.
  // It is necessary to define the initial state of the player.
  // Refer to Line 78.
  React.useEffect(() => {
    setInitialInClass(inClass);
  }, [screenType]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialInClass(inClass);
    }, TIMEOUT);
    return () => clearTimeout(timeout);
  }, [inClass]);

  return (
    <CSSTransition
      in={inClass}
      timeout={TIMEOUT}
      classNames={{
        enter: styles[`min${screenTypeName}`],
        enterActive: styles[`beingMax${screenTypeName}`],
        enterDone: styles[`max${screenTypeName}`],
        exit: styles[`max${screenTypeName}`],
        exitActive: styles[`beingMin${screenTypeName}`],
        exitDone: styles[`min${screenTypeName}`],
      }}
    >
      <div
        style={style}
        className={mergeClassNames(
          'relative overflow-hidden',
          isPresent || inClass ? null : 'opacity-0 pointer-events-none select-none',
          className,
          styles[`${initialInClass ? 'max' : 'min'}${screenTypeName}`],
        )}
      >
        {!inClass && <YTMaximizationHint onClick={onClick} />}
        {children}
      </div>
    </CSSTransition>
  );
};

export default YTWrapper;
